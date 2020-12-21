import { Box, Button, CheckBox, Text } from 'grommet'
import React, { useState } from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard'

import useWeb3Wallet from '../hooks/useWeb3Wallet'

const MetaMaskButton = () => {
  const termsAlreadyAccepted = localStorage.getItem('termsAccepted')
  const [termsAccepted, setTermsAccepted] = useState(!!termsAlreadyAccepted)
  const { isConnecting, isConnected, error, address, connect, disconnect, checkConnection } = useWeb3Wallet()
  const [triedToConnect, setTriedToConnect] = useState(false)
  if (!isConnecting && !error && !isConnected && termsAlreadyAccepted && !triedToConnect) {
    setTriedToConnect(true)
    checkConnection()
  }
  const DiconnectButton = (
    <Button
      onClick={() => {
        disconnect()
      }}
      primary
      margin="small"
      style={{ borderRadius: '10px', fontSize: '18px', fontWeight: 'bold' }}
      label="Disconnect a wallet"
    />
  )

  return (
    <>
      {isConnected ? (
        <Box direction="row">
          {DiconnectButton}
          <CopyToClipboard text={address}>
            <Button
              style={{ borderRadius: '10px', fontSize: '18px', fontWeight: 'bold' }}
              disabled={isConnecting}
              label={`Connected as ${address.substring(0, 6)}...${address.substring(38)}`}
            />
          </CopyToClipboard>
        </Box>
      ) : (
        <React.Fragment>
          <Box align="center">
            <CheckBox
              checked={termsAccepted}
              label={
                <Text>
                  I accept&nbsp;
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://gateway.ipfs.io/ipfs/QmUDosDLFs5rM3yAyU4GQK4Z81kMbMue8X298hbSyzgrPn"
                  >
                    Terms of Service
                  </a>
                </Text>
              }
              onChange={e => {
                setTermsAccepted(e.target.checked)
              }}
              margin="small"
            />
            <Box direction="row">
              <Button
                onClick={() => {
                  connect(true)
                }}
                primary
                margin="small"
                style={{ borderRadius: '10px', fontSize: '18px', fontWeight: 'bold' }}
                disabled={!termsAccepted || isConnecting}
                label="Connect to a wallet"
              />
            </Box>
          </Box>
        </React.Fragment>
      )}
      {error ? <Text margin={{ top: 'small' }}>{`Error connecting metamask: ${error}`}</Text> : null}
    </>
  )
}

export default MetaMaskButton
