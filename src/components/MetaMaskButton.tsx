import { Box, Button, CheckBox, Text } from 'grommet'
import React, { useState } from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard'

import useWeb3Wallet from '../hooks/useWeb3Wallet'

const MetaMaskButton = () => {
  const termsAlreadyAccepted = localStorage.getItem('termsAccepted')
  const [termsAccepted, setTermsAccepted] = useState(!!termsAlreadyAccepted)
  const [triedToConnect, setTriedToConnect] = useState(false)
  const { isConnecting, isConnected, error, address, connect, disconnect, checkConnection } = useWeb3Wallet()
  if (!isConnecting && !error && !isConnected && termsAlreadyAccepted && !triedToConnect) {
    setTriedToConnect(true)
    checkConnection()
  }
  const DiconnectButton = (
    <Button
      className="btn"
      onClick={() => {
        disconnect()
      }}
      primary
      margin="small"
      label="Disconnect"
    />
  )
  const connectedButton = () => (
    <div className="connection">
      {DiconnectButton}
      <CopyToClipboard text={address}>
        <Button
          className="btn btn--transparent"
          label={`Connected as ${address.substring(0, 6)}...${address.substring(38)}`}
        />
      </CopyToClipboard>
    </div>
  )

  return (
    <>
      {isConnected ? (
        connectedButton()
      ) : (
        <Box align="center">
          <Box direction="row">
            <Button
              className="btn"
              onClick={() => {
                connect(true)
              }}
              primary
              margin="small"
              disabled={!termsAccepted || isConnecting}
              label="Connect to a wallet"
            />
          </Box>
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
        </Box>
      )}
      {error ? <Text margin={{ top: 'small' }}>{`Error connecting metamask: ${error}`}</Text> : null}
    </>
  )
}

export default MetaMaskButton
