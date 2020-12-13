import { BehaviorSubject } from 'rxjs'

import { colAddresses, contractAddresses, duckAddresses, tokenSymbolsByAddress } from '../constants'
import { getErc20TokenAllowance } from '../contracts/erc20token/contractFunctions'
import { trackErc20TokenApproval } from '../contracts/erc20token/eventListeners'
import metamaskSubject from './metamaskSubject'

const tokens = [{ addresses: colAddresses }]

const { migration } = contractAddresses

interface Approval {
  address: string
  allowance: string
  symbol: string
}

export interface ApprovalsState {
  loading: boolean
  loaded: boolean
  allowances: {
    [token: string]: Approval
  }
}

const initialState: ApprovalsState = {
  loading: false,
  loaded: false,
  allowances: {},
}

const approvalsSubject: BehaviorSubject<ApprovalsState> = new BehaviorSubject(initialState)

const updateSubject = obj => {
  approvalsSubject.next({
    ...approvalsSubject.getValue(),
    ...obj,
  })
}

async function fetchApproval(walletAddress, tokenAddress: string): Promise<Approval> {
  const allowance = (await getErc20TokenAllowance(tokenAddress, walletAddress, migration)).toString()

  return {
    address: tokenAddress,
    allowance,
    symbol: tokenSymbolsByAddress(tokenAddress),
  }
}

function fetchApprovals(walletAddress: string, chainId: number): Promise<Approval[]> {
  return Promise.all(tokens.map(({ addresses }) => fetchApproval(walletAddress, addresses[chainId])))
}

async function fetchAndUpdateApproval(walletAddress, tokenAddress) {
  const approval = await fetchApproval(walletAddress, tokenAddress)
  const approvalObj = approvalsSubject.getValue().allowances
  approvalObj[tokenAddress] = approval
  updateSubject({ allowances: approvalObj })
}

const initializeApprovalsSubject = async providerState => {
  const { address, chainId } = providerState
  updateSubject({ loading: true })
  const allowances = {}
  ;(await fetchApprovals(address, chainId)).forEach(allowance => {
    allowances[allowance.address] = allowance
  })
  updateSubject({ loading: false, allowances })
  tokens.forEach(t => {
    trackErc20TokenApproval(
      {
        callback: async data => {
          updateSubject({ loading: true })
          // eslint-disable-next-line no-restricted-syntax
          for (const event of data) {
            await fetchAndUpdateApproval(address, event.address)
          }
          updateSubject({ loading: false })
        },
        contract: t.addresses[chainId],
        owner: providerState.address,
        spender: duckAddresses[chainId],
      },
      providerState.address,
    )
  })
}

metamaskSubject.subscribe(async providerState => {
  if (providerState.signer) {
    initializeApprovalsSubject(providerState)
  }
})

export default approvalsSubject
