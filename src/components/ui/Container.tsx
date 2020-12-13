import { Box } from 'grommet'
import React from 'react'
import styled from 'styled-components'

const RoundBox = styled(Box)`
  border-radius: 10px;
`

const Container = ({ children }: { children?: any }) => {
  return (
    <RoundBox border={{ color: 'brand', size: 'small' }} margin={{ vertical: 'small' }}>
      {children}
    </RoundBox>
  )
}

export default Container
