import React from 'react'
import { Button } from 'grommet'
import web3WalletSubject from '../../state/web3WalletSubject'
import useSubject from '../../hooks/useSubject'

const MainHeaderConnectionBtn = props => {
  const { connectHandler, disconnectHandler } = props
  const { isConnected } = useSubject(web3WalletSubject)

  return (
    <Button
      onClick={() => {
        if (isConnected) disconnectHandler()
        else connectHandler()
      }}
      primary
      margin="small"
      label={isConnected ? 'Disconnect' : 'Connect wallet'}
    />
  )
}

export default MainHeaderConnectionBtn
