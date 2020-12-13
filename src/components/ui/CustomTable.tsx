import { Box, Table, TableBody, TableCell, TableHeader, TableRow } from 'grommet'
import React from 'react'

interface Props {
  title: string
  columns: any[]
  data: any[]
  footer?: any
  header?: boolean
  width?: string
}

const CustomTable = ({ data, columns, title, header, width }: Props) => (
  <Box width={width}>
    <Table>
      {header && (
        <TableHeader>
          <TableRow>
            {columns.map(column => (
              <TableCell border={false} key={title + column.header} margin={column.margin}>
                {column.header}
              </TableCell>
            ))}
          </TableRow>
        </TableHeader>
      )}
      <TableBody>
        {data &&
          data.map((datum, i) => (
            <TableRow key={title + i}>
              {columns.map(column => (
                <TableCell
                  key={title + datum.action + column.property}
                  scope="col"
                  margin={column.margin}
                  align="start"
                >
                  {column.render ? column.render(datum) : datum[column.property]}
                </TableCell>
              ))}
            </TableRow>
          ))}
      </TableBody>
    </Table>
  </Box>
)

export default CustomTable
