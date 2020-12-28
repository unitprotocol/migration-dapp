import { Box, Grommet } from 'grommet'
import React, { Suspense } from 'react'
import ReactDOM from 'react-dom'
import styled from 'styled-components'

import Balances from './components/Balances'
import MetaMaskButton from './components/MetaMaskButton'
import Migration from './components/Migration'
import Transactions from './components/Transactions'
import useWeb3Wallet from './hooks/useWeb3Wallet'
// css
import './style/main.css'
import MainHeader from './components/MainHeader/MainHeader.tsx'

const AppContainer = styled(Box)`
  max-width: 1100px;
`

const HeaderWrapper = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  width: 100%;
  justify-content: space-between;
`

function App() {
  const { isConnected } = useWeb3Wallet()
  return (
    <Suspense fallback={null}>
      <Box align="center" justify="center" direction="row">
        <Box
          className="main-wrap"
          background="white"
          direction="column"
          flex="grow"
          pad={{ horizontal: 'medium', bottom: 'medium' }}
        >
          <MainHeader/>
          {isConnected && <Balances />}
          <Migration />
          <Transactions />
        </Box>
      </Box>
    </Suspense>
  )
}

const rootElement = document.getElementById('root')

const myTheme = {
  global: {
    font: {
      family: 'Lato',
    },
    colors: {
      brand: 'rgb(172, 12, 238)',
      // focus: 'rgb(203,0,255)',
    },
  },
}

const Index = () => (
  <Grommet theme={myTheme}>
    <App />
  </Grommet>
)

ReactDOM.render(<Index />, rootElement)
