import { Box, Button, CheckBox, Text } from 'grommet'
import React, { useState } from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard'

import useMetamask from '../hooks/useMetamask'

const MetaMaskButton = () => {
  const termsAlreadyAccepted = localStorage.getItem('termsAccepted')
  const [termsAccepted, setTermsAccepted] = useState(!!termsAlreadyAccepted)
  const { isConnecting, isConnected, error, address, connectMetamask } = useMetamask()
  if (!isConnecting && !error && !isConnected && termsAlreadyAccepted) connectMetamask()
  return (
    <>
      {isConnected ? (
        <CopyToClipboard text={address}>
          <Button
            style={{ borderRadius: '10px', fontSize: '18px', fontWeight: 'bold' }}
            disabled={isConnecting}
            label={`Connected as ${address.substring(0, 6)}...${address.substring(38)}`}
          />
        </CopyToClipboard>
      ) : (
        <React.Fragment>
          <Box width="medium" align="center">
            <CheckBox
              checked={termsAccepted}
              label={
                <Text>
                  I accept{' '}
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
            <Button
              onClick={() => {
                connectMetamask(true)
              }}
              primary
              margin="small"
              style={{ borderRadius: '10px', fontSize: '18px', fontWeight: 'bold' }}
              disabled={!termsAccepted || isConnecting}
              label="Connect to MetaMask"
            />
          </Box>
        </React.Fragment>
      )}
      {error ? <Text margin={{ top: 'small' }}>{`Error connecting metamask: ${error}`}</Text> : null}
    </>
  )
}

export default MetaMaskButton
