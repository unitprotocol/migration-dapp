import React, { useState } from 'react'
import { CheckBox, Text } from 'grommet'

const MainHeaderTerms = () => {
  const termsAlreadyAccepted = localStorage.getItem('termsAccepted')
  const [termsAccepted, setTermsAccepted] = useState(!!termsAlreadyAccepted)

  return (
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
  )
}

export default MainHeaderTerms
