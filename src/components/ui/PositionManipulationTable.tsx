import { Anchor, Box, Text, TextInput } from 'grommet'
import React from 'react'

import { logoBySymbol } from '../../constants'
import TableBox from './TableBox'

interface Props {
  title: string
  data: any[]
  footer?: any
  addSymbol?: any
}

const PositionManipulationTable = ({ title, data, footer }: Props) => {
  const tokenWithLogo = ({ action }) => {
    const symbol = extractSymbolFromAction(action)
    return (
      <>
        <Box direction="row">
          {logoBySymbol[symbol].logo}
          <Text style={{ marginLeft: '10px' }}>{symbol}</Text>
        </Box>
      </>
    )
  }

  const MinColAnchor = datum => {
    if (datum.minCol) {
      const [value, percent] = datum.minCol
      return (
        <Anchor
          disabled={datum.value === value}
          style={{ marginRight: '10px' }}
          color="black"
          label={`${percent}%`}
          onClick={() => datum.setValue(value)}
        />
      )
    }
  }

  const MaxColAnchor = datum => {
    if (datum.maxCol) {
      const [value, percent] = datum.maxCol
      return (
        <Anchor
          disabled={datum.value === value}
          style={{ marginRight: '10px' }}
          color="black"
          label={`${percent}%`}
          onClick={() => datum.setValue(value)}
        />
      )
    }
  }

  const MaxAnchor = datum => {
    if (datum.max) {
      const maxValue = datum.decreaseMax ? Number(datum.max) * 0.98 : datum.max
      if (datum.percentage) {
        const per25 = Number(datum.max) / 4
        const per50 = Number(datum.max) / 2
        const per75 = per50 + per25

        return (
          <React.Fragment>
            <Anchor
              disabled={Number(datum.value) === per25}
              style={{ marginRight: '12px' }}
              color="black"
              label="25%"
              onClick={() => datum.setValue(per25)}
            />
            <Anchor
              disabled={Number(datum.value) === per50}
              style={{ marginRight: '12px' }}
              color="black"
              label="50%"
              onClick={() => datum.setValue(per50)}
            />
            <Anchor
              disabled={Number(datum.value) === per75}
              style={{ marginRight: '12px' }}
              color="black"
              label="75%"
              onClick={() => datum.setValue(per75)}
            />
            <Anchor
              disabled={datum.value === maxValue}
              color="black"
              label="100%"
              onClick={() => datum.setValue(maxValue)}
            />
          </React.Fragment>
        )
      }
      return (
        <Anchor
          disabled={datum.value === maxValue}
          color="black"
          label="Max"
          onClick={() => datum.setValue(maxValue)}
        />
      )
    }
  }

  return (
    <TableBox
      title={title}
      columns={[
        {
          property: 'action',
          render: tokenWithLogo,
        },
        {
          property: 'component',
          render: datum => {
            const maxValue = datum.max ? (datum.decreaseMax ? Number(datum.max) * 0.98 : datum.max) : null
            const v = String(datum.value)
            const step = v.includes('.') ? `1e-${v.length - v.indexOf('.') - 1}` : 1
            return (
              <span style={{ textAlign: 'right', width: '100%' }}>
                <TextInput
                  type="number"
                  min={0}
                  step={step}
                  value={datum.value}
                  onChange={e => datum.setValue(e.currentTarget.value)}
                  style={
                    (maxValue || maxValue === 0) && Number(datum.value) > Number(maxValue)
                      ? { borderColor: 'red', borderWidth: '2px' }
                      : {}
                  }
                />
                {MinColAnchor(datum)}
                {MaxColAnchor(datum)}
                {MaxAnchor(datum)}
              </span>
            )
          },
        },
      ]}
      data={data}
      footer={footer}
    />
  )
}

function extractSymbolFromAction(action) {
  let lastIndex = action.indexOf(' withdraw')
  if (lastIndex === -1) {
    lastIndex = action.indexOf(' deposit')
  }
  if (lastIndex === -1) {
    lastIndex = action.indexOf(' borrow')
  }
  if (lastIndex === -1) {
    lastIndex = action.indexOf(' repay')
  }
  return action.substr(0, lastIndex)
}

export default PositionManipulationTable
