import * as ethers from 'ethers'

import * as constants from '../../constants'
import { sendTransaction } from '../../state/transactionsSubject'
import abi from '../abis/Migration.json'

function getMigrationContract(provider, contractAddress) {
  return new ethers.Contract(contractAddress, abi, provider)
}

function submitMigrationQuack(contractAddress, signer, options = {}) {
  const contract = getMigrationContract(signer, contractAddress)
  return sendTransaction(contract, 'quack', [{ ...options }])
}

function getMigrationAllowance(contractAddress, owner, spender) {
  const contract = getMigrationContract(constants.ethersProvider, contractAddress)
  return contract.allowance(owner, spender)
}

function submitMigrationTransfer(contractAddress, receiver, amount, signer, options = {}) {
  const contract = getMigrationContract(signer, contractAddress)
  return sendTransaction(contract, 'transfer', [receiver, amount, { ...options }])
}

function submitMigrationTransferFrom(contractAddress, owner, receiver, amount, signer, options = {}) {
  const contract = getMigrationContract(signer, contractAddress)
  return sendTransaction(contract, 'transferFrom', [owner, receiver, amount, { ...options }])
}

function submitMigrationApprove(contractAddress, spender, amount, signer, options = {}) {
  const contract = getMigrationContract(signer, contractAddress)
  return sendTransaction(contract, 'approve', [spender, amount, { ...options }])
}

function submitMigrationBurn(contractAddress, amount, signer, options = {}) {
  const contract = getMigrationContract(signer, contractAddress)
  return sendTransaction(contract, 'burn', [amount, { ...options }])
}

function getMigrationName(contractAddress) {
  const contract = getMigrationContract(constants.ethersProvider, contractAddress)
  return contract.name()
}

function getMigrationSymbol(contractAddress) {
  const contract = getMigrationContract(constants.ethersProvider, contractAddress)
  return contract.symbol()
}

function getMigrationDecimals(contractAddress) {
  const contract = getMigrationContract(constants.ethersProvider, contractAddress)
  return contract.decimals()
}

function getMigrationBalanceOf(contractAddress, arg0) {
  const contract = getMigrationContract(constants.ethersProvider, contractAddress)
  return contract.balanceOf(arg0)
}

function getMigrationTotalSupply(contractAddress) {
  const contract = getMigrationContract(constants.ethersProvider, contractAddress)
  return contract.totalSupply()
}

export {
  submitMigrationQuack,
  getMigrationAllowance,
  submitMigrationTransfer,
  submitMigrationTransferFrom,
  submitMigrationApprove,
  submitMigrationBurn,
  getMigrationName,
  getMigrationSymbol,
  getMigrationDecimals,
  getMigrationBalanceOf,
  getMigrationTotalSupply,
}
