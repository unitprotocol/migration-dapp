import { Box, Button } from 'grommet'
import React, { useState } from 'react'

import { colAddresses, duckAddresses, MIGRATION_SECTION_NAME } from '../constants'
import { useApprovals } from '../hooks/useApprovals'
import useBalances from '../hooks/useBalances'
import useContracts from '../hooks/useContracts'
import useWeb3Wallet from '../hooks/useWeb3Wallet'
import { getAtomicAmountFromDisplayAmount, getDisplayAmountFromAtomicAmount } from '../utils'
import PositionManipulationTable from './ui/PositionManipulationTable'

const Migration = () => {
  const { balances } = useBalances()
  const { migrate } = useContracts()
  const { signer, isConnected: isAccountConnected, chainId } = useWeb3Wallet()
  const [colAmount, setColAmount] = useState('0')

  const maxColDeposit = balances[colAddresses[chainId]]
    ? getDisplayAmountFromAtomicAmount(balances[colAddresses[chainId]].balance, colAddresses[chainId], false)
    : '0'

  const remainingApprovals = useApprovals(getAtomicAmountFromDisplayAmount(maxColDeposit, colAddresses[chainId]))

  const data = []

  function clearValues() {
    setColAmount('0')
  }

  const duckAmount = getDisplayAmountFromAtomicAmount(
    (BigInt(getAtomicAmountFromDisplayAmount(maxColDeposit, colAddresses[chainId])) / BigInt(100)).toString(),
    duckAddresses[chainId],
  )

  const footer = (
    <Box pad="small">
      <Button
        style={{ borderRadius: '10px', fontSize: '18px', fontWeight: 'bold' }}
        onClick={async () => {
          // eslint-disable-next-line no-restricted-syntax
          for (const a of remainingApprovals) {
            if (!(await a.approveToken())) {
              return
            }
          }
          migrate({ signer, chainId }, colAmount, !!remainingApprovals.length, clearValues)
        }}
        primary
        label={
          isAccountConnected
            ? balances[colAddresses[chainId]]
              ? Number(duckAmount) === 0
                ? 'Nothing to migrate'
                : `Receive ${duckAmount} DUCK`
              : 'Fetching data...'
            : 'Login to interact'
        }
        disabled={!isAccountConnected || !balances[colAddresses[chainId]] || Number(duckAmount) === 0}
      />
    </Box>
  )

  return <PositionManipulationTable title={MIGRATION_SECTION_NAME} data={data} footer={footer} />
}

export default Migration
