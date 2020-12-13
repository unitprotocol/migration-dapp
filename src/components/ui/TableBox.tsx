import { Box, Heading } from 'grommet'
import React from 'react'

import Container from './Container'
import CustomTable from './CustomTable'

interface Props {
  title: string
  columns: any[]
  data: any[]
  footer?: any
  header?: boolean
  width?: string
}

const TableBox = ({ title, data, footer, columns, width }: Props) => {
  return (
    <Container>
      <Box fill="horizontal" pad="medium">
        <Heading level={3} margin="small">
          {title}
        </Heading>
        <CustomTable data={data} columns={columns} title={title} header={columns.some(c => c.header)} width={width} />
      </Box>
      {footer || null}
    </Container>
  )
}

export default TableBox
