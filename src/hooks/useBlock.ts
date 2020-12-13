import blockSubject from '../state/blockSubject'
import useSubject from './useSubject'

function useBlock() {
  return useSubject(blockSubject)
}

export default useBlock
