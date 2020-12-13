import { Box, Grommet } from 'grommet'
import React, { Suspense } from 'react'
import ReactDOM from 'react-dom'
import styled from 'styled-components'

import Balances from './components/Balances'
import MetaMaskButton from './components/MetaMaskButton'
import Migration from './components/Migration'
import Transactions from './components/Transactions'
import useMetamask from './hooks/useMetamask'

const AppContainer = styled(Box)`
  max-width: 1100px;
`

const HeaderWrapper = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  width: 100%;
  justify-content: space-between;
`

function App() {
  const { isConnected } = useMetamask()
  return (
    <Suspense fallback={null}>
      <Box align="center" justify="center" direction="row">
        <AppContainer
          background="white"
          direction="column"
          flex="grow"
          pad={{ horizontal: 'medium', bottom: 'medium' }}
        >
          <HeaderWrapper>
            <Box align="center" as="header" direction="row" flex={false} gap="medium" justify="between">
              <img
                src={`${process.env.PUBLIC_URL}/unit_logo.png`}
                style={{ maxWidth: '178px', maxHeight: '100px' }}
                alt="unit-protocol-logo"
              />
              <MetaMaskButton />
            </Box>
          </HeaderWrapper>
          {isConnected && <Balances />}
          <Migration />
          <Transactions />
        </AppContainer>
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
      brand: 'rgb(242, 193, 241)',
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
