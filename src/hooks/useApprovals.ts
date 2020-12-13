import { colAddresses, duckAddresses, MAX_UINT } from '../constants'
import { submitErc20TokenApprove } from '../contracts/erc20token/contractFunctions'
import approvalsSubject, { ApprovalsState } from '../state/approvalsSubject'
import useMetamask from './useMetamask'
import useSubject from './useSubject'

const approveToken = async (signer: any, tokenAddress: string) => {
  const approvalTx = await submitErc20TokenApprove(tokenAddress, duckAddresses[1], MAX_UINT, signer)
  if (approvalTx.error) return false
  approvalTx.wait()
  return true
}

function useApprovals(
  colAmount: string,
): {
  approveToken: () => any
}[] {
  const { signer, chainId } = useMetamask()
  const approvalsState: ApprovalsState = useSubject(approvalsSubject)

  const colAllowance = approvalsState.allowances[colAddresses[chainId]]

  if (!colAllowance) return []

  const remainingApprovals = []

  if (BigInt(colAmount) > BigInt(colAllowance.allowance)) {
    remainingApprovals.push({
      token: colAddresses[chainId],
      approveToken: () => approveToken(signer, colAddresses[chainId]),
    })
  }

  return remainingApprovals
}

export { useApprovals }
