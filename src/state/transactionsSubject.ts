import { BehaviorSubject } from 'rxjs'

import { web3Provider } from '../constants'

export interface TransactionState {
  hash: string
  status: TransactionStatus
  error: any
}

export enum TransactionStatus {
  Pending,
  Mined,
}

const initialState = null

const transactions = {}

const transactionsSubject: BehaviorSubject<TransactionState> = new BehaviorSubject(initialState)

const updateSubject = obj => {
  transactionsSubject.next({
    ...transactionsSubject.getValue(),
    ...obj,
  })
}

function addPendingTx(hash) {
  const transaction = {
    hash,
    status: TransactionStatus.Pending,
    error: null,
  }
  transactions[hash] = TransactionStatus.Pending
  updateSubject(transaction)
}

function addError(error) {
  const transaction = {
    error,
    hash: null,
    status: null,
  }
  updateSubject(transaction)
}

function markTxMined(hash) {
  const transaction = {
    hash,
    status: TransactionStatus.Mined,
    error: null,
  }
  transactions[hash] = TransactionStatus.Mined
  updateSubject(transaction)
}

async function trackTx(tx) {
  if (transactions[tx.hash] && transactions[tx.hash].status === TransactionStatus.Pending) return
  addPendingTx(tx.hash)
  await tx.wait()
  markTxMined(tx.hash)
}

export async function sendTransaction(contract, fnName, prm) {
  // try to estimate gas when gasLimit not set
  if (!prm[prm.length - 1].gasLimit) {
    prm[prm.length - 1] = { ...prm[prm.length - 1], gasLimit: 3_000_000 }
    const gas = await contract.estimateGas[fnName](...prm).catch(error => {
      return { error }
    })
    if (gas.error) {
      console.log('aaa error')
      addError(gas.error)
      return {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        wait: () => {},
        error: true,
      }
    }
    prm[prm.length - 1] = { ...prm[prm.length - 1], gasLimit: Number(gas) + 150_000 }
  }
  let gasPrice = await web3Provider.eth.getGasPrice()
  gasPrice = String(Number(gasPrice) * 110)
  gasPrice = gasPrice.substr(0, gasPrice.length - 2)

  prm[prm.length - 1] = { ...prm[prm.length - 1], gasPrice }
  const tx = await contract[fnName](...prm).catch(error => {
    return { error }
  })
  if (tx.error) {
    addError(tx.error)
    return {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      wait: () => {},
      error: true,
    }
  }
  console.log(tx)
  trackTx(tx)
  return tx
}

export default transactionsSubject
