import MewConnect from '@myetherwallet/mewconnect-web-client'
import WalletConnectProvider from '@walletconnect/web3-provider'
import * as ethers from 'ethers'
import Web3Modal from 'web3modal'

import blockSubject from '../state/blockSubject'
import web3WalletSubject from '../state/web3WalletSubject'
import useSubject from './useSubject'
import isMobile from '../helpers/isMobile'

const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider, // required
    options: {
      infuraId: '32528b13d24c4a139a35e6f95c0c94b8', // required
    },
  },
  mewconnect: {
    package: MewConnect, // required
    options: {
      infuraId: '32528b13d24c4a139a35e6f95c0c94b8', // required
    },
  },
}

const web3Modal = new Web3Modal({
  cacheProvider: true, // optional
  providerOptions, // required,
})

const updateSubject = obj => {
  web3WalletSubject.next({
    ...web3WalletSubject.getValue(),
    ...obj,
  })
}

let provider

// for stupid immutable ethers
async function initProvider() {
  if (isMobile() && window.web3 && (window.web3.currentProvider.isTrust || window.web3.currentProvider.isMetaMask)) {
    if (window.ethereum) provider = new ethers.providers.Web3Provider(window.ethereum)
    else if (window.web3) provider = new ethers.providers.Web3Provider(window.web3.currentProvider)
  } else {
    const web3ModalProvider = await web3Modal.connect()
    provider = new ethers.providers.Web3Provider(web3ModalProvider)
  }
  if (provider && provider.provider) provider.provider.autoRefreshOnNetworkChange = false
}

function useWeb3Wallet() {
  const state = useSubject(web3WalletSubject)

  const checkConnection = async () => {
    if (isMobile() && window.web3 && (window.web3.currentProvider.isTrust || window.web3.currentProvider.isMetaMask)) {
      await connect()
    } else if (web3Modal.cachedProvider) {
      await connect()
    }
  }

  const connect = async (updateTermsBlock = false) => {
    updateSubject({
      isConnecting: true,
    })
    try {
      if (updateTermsBlock) {
        localStorage.setItem('termsAccepted', String(blockSubject.getValue().number))
      }

      await initProvider()
      if (!provider) {
        updateSubject({
          error: '',
          isConnecting: false,
          isConnected: false,
        })
        return
      }
      subscribeProvider()

      await setChainId()
      await setAccount()
    } catch (e) {
      console.error(e)
    }

    updateSubject({
      isConnecting: false,
    })
  }

  const disconnect = async () => {
    if (provider && provider.close) await provider.close()
    web3Modal.clearCachedProvider()
    updateSubject({
      error: '',
      isConnecting: false,
      isConnected: false,
    })
  }

  return {
    ...state,
    connect,
    disconnect,
    checkConnection,
  }
}

function subscribeProvider(): void {
  if (!provider && !provider.provider.on) {
    return
  }
  provider.provider.on('accountsChanged', async () => {
    await initProvider()
    await setAccount()
  })

  provider.provider.on('chainChanged', async () => {
    await initProvider()
    await setChainId()
    console.log('chainChanged')
  })
}

async function setChainId() {
  const network = await provider.getNetwork()
  if (network.chainId !== 1) {
    updateSubject({
      error: 'Please switch network to Mainnet',
      isConnected: false,
    })
  } else {
    updateSubject({
      error: '',
      chainId: network.chainId,
    })
  }
}

async function setAccount() {
  const accounts = await provider.listAccounts()
  const signer = provider.getSigner()
  const address = accounts[0]
  if (!address) {
    if (provider && provider.close) await provider.close()
    web3Modal.clearCachedProvider()
    updateSubject({
      error: '',
      isConnected: false,
    })
  }

  window.localStorage.setItem('connectedAddress', address.toLowerCase())

  updateSubject({
    address,
    isConnected: true,
    signer,
  })
}

export default useWeb3Wallet
