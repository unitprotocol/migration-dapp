import { Signer } from 'ethers'
import { BehaviorSubject } from 'rxjs'

export interface MetamaskState {
  signer: null | Signer
  address: string
  isConnecting: boolean
  isConnected: boolean
  error: string
  chainId: number
}

const initialState: MetamaskState = {
  signer: null,
  address: '',
  isConnecting: false,
  isConnected: false,
  error: '',
  chainId: 1,
}

const metamaskSubject: BehaviorSubject<MetamaskState> = new BehaviorSubject(initialState)

export default metamaskSubject
