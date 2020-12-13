import { Box, Button } from 'grommet'
import React from 'react'

import Container from './ui/Container'

const BootstrapLiquidity = () => {
  return (
    <Container>
      <Box direction="column" justify="center" align="center" pad="medium" gap="medium">
        <Button label="Get ETH for test" primary />
        <Button label="Get tokens for test" primary />
      </Box>
    </Container>
  )
}

export default BootstrapLiquidity
