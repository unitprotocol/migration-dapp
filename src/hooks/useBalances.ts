import balancesSubject, { BalancesState } from '../state/balancesSubject'
import useSubject from './useSubject'

function useBalances(): BalancesState {
  return useSubject(balancesSubject)
}

export default useBalances
