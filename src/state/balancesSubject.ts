import { BehaviorSubject } from 'rxjs'

import { colAddresses, duckAddresses, ethMockAddress, tokenSymbolsByAddress, web3Provider } from '../constants'
import { getErc20TokenBalanceOf } from '../contracts/erc20token/contractFunctions'
import { trackErc20TokenTransfer } from '../contracts/erc20token/eventListeners'
import eventTracker from '../contracts/websocketEventTracker'
import { getDisplayAmountFromAtomicAmount } from '../utils'
import metamaskSubject from './metamaskSubject'

const initialState: BalancesState = {
  loading: false,
  loaded: false,
  balances: {},
}

interface Balance {
  address: string
  balance: string
  balanceFormatted: string
  symbol: string
}

export interface BalancesState {
  loading: boolean
  loaded: boolean
  balances: {
    [token: string]: Balance
  }
}

const balancesSubject: BehaviorSubject<BalancesState> = new BehaviorSubject(initialState)

const updateSubject = obj => {
  balancesSubject.next({
    ...balancesSubject.getValue(),
    ...obj,
  })
}

async function fetchBalance(walletAddress, tokenAddress: string, chainId: number): Promise<Balance> {
  if (tokenAddress === ethMockAddress[chainId]) {
    return fetchEthBalance(walletAddress, tokenAddress)
  }
  const balanceValue = (await getErc20TokenBalanceOf(tokenAddress, walletAddress)).toString()
  const balanceValueFormatted = getDisplayAmountFromAtomicAmount(balanceValue, tokenAddress)

  const symbol = tokenSymbolsByAddress(tokenAddress)
  return {
    address: tokenAddress,
    balance: balanceValue,
    balanceFormatted: balanceValueFormatted,
    symbol: symbol === 'ETH' ? 'WETH' : symbol,
  }
}

async function fetchEthBalance(walletAddress, tokenAddress) {
  const balanceValue = (await web3Provider.eth.getBalance(walletAddress)).toString()
  const balanceValueFormatted = getDisplayAmountFromAtomicAmount(balanceValue, tokenAddress)

  return {
    address: tokenAddress,
    balance: balanceValue,
    balanceFormatted: balanceValueFormatted,
    symbol: 'ETH',
  }
}

const tokenAddressesForBalances = [colAddresses, duckAddresses]

function fetchBalances(walletAddress, chainId): Promise<Balance[]> {
  return Promise.all(
    tokenAddressesForBalances.map(tokenAddress => {
      return fetchBalance(walletAddress, tokenAddress[chainId], chainId)
    }),
  )
}

async function updateBalances(address, chainId) {
  updateSubject({ loading: true })
  const balancesArray: Balance[] = await fetchBalances(address, chainId)
  const balances = {}
  balancesArray.forEach(balance => {
    balances[balance.address] = balance
  })
  updateSubject({ loading: false, balances })
}

let walletAddress

const initializeBalanceTracking = chainId => {
  tokenAddressesForBalances.forEach(addresses => {
    trackErc20TokenTransfer(
      {
        callback: () => {
          updateBalances(walletAddress, chainId) // this updates all balances on any transer, this needs to be re-done to be more granular in the future
        },
        contract: addresses[chainId],
        from: walletAddress,
        to: '',
      },
      walletAddress,
    )
    trackErc20TokenTransfer(
      {
        callback: () => {
          updateBalances(walletAddress, chainId) // this updates all balances on any transer, this needs to be re-done to be more granular in the future
        },
        contract: addresses[chainId],
        from: '',
        to: walletAddress,
      },
      walletAddress,
    )
  })
}

metamaskSubject.subscribe(async providerState => {
  if (providerState.signer) {
    await eventTracker.clearSubscriptionsOfAddress(walletAddress)
    walletAddress = providerState.address
    await updateBalances(providerState.address, providerState.chainId)
    initializeBalanceTracking(providerState.chainId)
  }
})

export default balancesSubject
