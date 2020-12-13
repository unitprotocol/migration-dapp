import { Box, Text } from 'grommet'
import React from 'react'

import { logoBySymbol } from '../../constants'

interface Props {
  symbol: string
}

const TokenWithLogo = ({ symbol }: Props) => {
  const searchSymbol = symbol === 'WETH' ? 'ETH' : symbol
  return (
    <Box direction="row">
      {logoBySymbol[searchSymbol].logo}
      <Text style={{ marginLeft: '10px' }}>{symbol}</Text>
    </Box>
  )
}

export default TokenWithLogo
