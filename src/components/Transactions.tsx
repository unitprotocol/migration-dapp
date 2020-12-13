import React from 'react'
import { ToastProvider, useToasts } from 'react-toast-notifications'

import transactionsSubject, { TransactionStatus } from '../state/transactionsSubject'

let toast

const FormWithToasts = () => {
  toast = useToasts().addToast

  return <form />
}

transactionsSubject.subscribe(tx => {
  if (!tx) return
  if (tx.status === TransactionStatus.Pending) {
    toast('Transaction submitted', { appearance: 'info', autoDismiss: true })
  } else if (tx.status === TransactionStatus.Mined) {
    toast('Transaction mined', { appearance: 'success', autoDismiss: true })
  } else if (tx.error) {
    if (tx.error.code === 4001) {
      toast('Transaction has been cancelled', { appearance: 'warning', autoDismiss: true })
    } else if (tx.error.error && tx.error.error.message.includes('execution reverted: ')) {
      const message = tx.error.error.message.substring('execution reverted: '.length)
      toast(message, { appearance: 'error', autoDismiss: true })
    } else {
      console.log(tx)
      toast('It seems this transaction will fail', { appearance: 'error', autoDismiss: true })
    }
  }
})

const Transactions = () => (
  <ToastProvider>
    <FormWithToasts />
  </ToastProvider>
)

export default Transactions
