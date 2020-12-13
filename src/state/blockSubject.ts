import _ from 'lodash'
import { BehaviorSubject } from 'rxjs'

import { web3Provider } from '../constants'

export interface BlockState {
  number: number
  hash: string
  timestamp: number
}

const initialState: BlockState = {
  number: null,
  hash: null,
  timestamp: null,
}

const blockSubject: BehaviorSubject<BlockState> = new BehaviorSubject(initialState)

const updateSubject = obj => {
  blockSubject.next({
    ...blockSubject.getValue(),
    ...obj,
  })
}

const initializeBlockSubject = _.once(async () => {
  const currentBlock = await web3Provider.eth.getBlock('latest')
  updateSubject({ number: currentBlock.number, hash: currentBlock.hash, timestamp: currentBlock.timestamp })
})

initializeBlockSubject()

export default blockSubject
