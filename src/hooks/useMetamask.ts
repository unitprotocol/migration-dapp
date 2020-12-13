import * as ethers from 'ethers'
import _ from 'lodash'

import blockSubject from '../state/blockSubject'
import metamaskSubject from '../state/metamaskSubject'
import useSubject from './useSubject'

const updateSubject = obj => {
  metamaskSubject.next({
    ...metamaskSubject.getValue(),
    ...obj,
  })
}

function useMetamask() {
  const state = useSubject(metamaskSubject)

  const connectMetamask = (updateTermsBlock = false) => {
    console.log('metamask connect')
    if (updateTermsBlock) localStorage.setItem('termsAccepted', String(blockSubject.getValue().number))
    updateSubject({
      error: '',
      isConnecting: true,
    })

    if (!window['ethereum']) {
      updateSubject({
        error: 'No wallet detected in browser',
        isConnecting: false,
      })
      return
    }

    let chainId = checkChainId()
    if (Number.isNaN(chainId)) {
      setTimeout(() => connectMetamask(), 10)
    }
    if (![1].includes(chainId)) return

    window['ethereum'].on('accountsChanged', accounts => {
      console.log('wallet changed')
      setAccount(accounts, chainId)
    })

    window['ethereum'].on('chainChanged', () => {
      console.log('network changed')
      chainId = checkChainId()
    })

    return window['ethereum'].sendAsync({ method: 'eth_requestAccounts' }, (err, response) => {
      const addresses = _.get(response, 'result')
      if (err) {
        updateSubject({ error: err.message, isConnecting: false })
        return
      }
      setAccount(addresses, chainId)
    })
  }

  return {
    ...state,
    connectMetamask,
  }
}

function checkChainId(): number {
  const id = parseInt(window['ethereum']['chainId'], 16)
  if (![1].includes(id)) {
    updateSubject({
      error: 'Please switch network to Mainnet',
      isConnecting: false,
      isConnected: false,
    })
  }
  return id
}

function setAccount(addresses, chainId: number) {
  const provider = new ethers.providers.Web3Provider(window['ethereum'])
  const signer = provider.getSigner()
  const address = addresses[0].toLowerCase()

  window.localStorage.setItem('connectedAddress', address)

  updateSubject({
    address,
    isConnected: true,
    isConnecting: false,
    signer,
    chainId,
  })
}

export default useMetamask
