import * as ethers from 'ethers'

import * as constants from '../../constants'
import { sendTransaction } from '../../state/transactionsSubject'
import abi from '../abis/ERC20.json'

function getErc20TokenContract(provider, contractAddress) {
  return new ethers.Contract(contractAddress, abi, provider)
}

function getErc20TokenAllowance(contractAddress, owner, spender) {
  const contract = getErc20TokenContract(constants.ethersProvider, contractAddress)
  return contract.allowance(owner, spender)
}

function submitErc20TokenApprove(contractAddress, spender, value, signer, options = {}) {
  const contract = getErc20TokenContract(signer, contractAddress)
  return sendTransaction(contract, 'approve', [spender, value, { ...options }])
}

function getErc20TokenBalanceOf(contractAddress, who) {
  const contract = getErc20TokenContract(constants.ethersProvider, contractAddress)
  return contract.balanceOf(who)
}

function getErc20TokenTotalSupply(contractAddress) {
  const contract = getErc20TokenContract(constants.ethersProvider, contractAddress)
  return contract.totalSupply()
}

function submitErc20TokenTransfer(contractAddress, to, value, signer, options = {}) {
  const contract = getErc20TokenContract(signer, contractAddress)
  return sendTransaction(contract, 'transfer', [to, value, { ...options }])
}

function submitErc20TokenTransferFrom(contractAddress, from, to, value, signer, options = {}) {
  const contract = getErc20TokenContract(signer, contractAddress)
  return sendTransaction(contract, 'transferFrom', [from, to, value, { ...options }])
}

export {
  getErc20TokenAllowance,
  submitErc20TokenApprove,
  getErc20TokenBalanceOf,
  getErc20TokenTotalSupply,
  submitErc20TokenTransfer,
  submitErc20TokenTransferFrom,
}
