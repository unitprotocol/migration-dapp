import _ from 'lodash'
import { BehaviorSubject } from 'rxjs'

import { collateralTokens } from '../constants'
import { Token } from '../types/types'

export type MainAssetState = Token

const mainAssetSubject: BehaviorSubject<Token | undefined> = new BehaviorSubject(_.first(collateralTokens))

const updateSubject = obj => {
  mainAssetSubject.next({
    ...mainAssetSubject.getValue(),
    ...obj,
  })
}

export function setMainAsset(asset: MainAssetState) {
  updateSubject(asset)
}

export default mainAssetSubject
