import mainAssetSubject, { MainAssetState } from '../state/mainAssetSubject'
import useSubject from './useSubject'

function useMainAsset(): MainAssetState {
  return useSubject(mainAssetSubject)
}

export default useMainAsset
