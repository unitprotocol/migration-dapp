import transactionsSubject, { TransactionState } from '../state/transactionsSubject'
import useSubject from './useSubject'

function useTransactions(): TransactionState {
  return useSubject(transactionsSubject)
}

export default useTransactions
