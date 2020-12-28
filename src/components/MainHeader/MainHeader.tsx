import React from 'react'
import MetaMaskButton from '../MetaMaskButton'
import useWeb3Wallet from '../../hooks/useWeb3Wallet'

const MainHeader = () => {
  const { connect, disconnect } = useWeb3Wallet()
  return (
    <div className="main-header">
      <img className="main-header__logo" src={`${process.env.PUBLIC_URL}/unit_logo.png`} alt="unit-protocol-logo" />
      <MetaMaskButton />
    </div>
  )
}

export default MainHeader
