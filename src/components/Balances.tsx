import { Box } from 'grommet'
import React from 'react'

import { defaultBalanceList } from '../constants'
import useBalances from '../hooks/useBalances'
import useMetamask from '../hooks/useMetamask'
import Spinner from './ui/Spinner'
import TableBox from './ui/TableBox'
import TokenWithLogo from './ui/TokenWithLogo'

const Balances = () => {
  const { loading, balances } = useBalances()
  const { chainId } = useMetamask()
  const filteredBalances = Object.values(balances).filter(() => [...defaultBalanceList(chainId)])

  return (
    <TableBox
      title="Your Balances"
      columns={[
        {
          property: 'symbol',
          header: 'Asset',
          primary: false,
          margin: { right: 'xlarge' },
          render: TokenWithLogo,
        },
        {
          property: 'balanceFormatted',
          header: 'Balance',
          margin: { left: 'xlarge' },
        },
      ]}
      data={filteredBalances}
      footer={
        loading ? (
          <Box margin="medium">
            <Spinner />
          </Box>
        ) : null
      }
      header
      width="medium"
    />
  )
}

export default Balances
