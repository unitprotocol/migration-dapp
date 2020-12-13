import { Button, Text } from 'grommet'
import React, { useState } from 'react'

const TransactionButton = ({ label, transactionFn }) => {
  const [pending, setPending] = useState(false)
  const [completed, setCompleted] = useState(false)
  return (
    <>
      {completed || pending ? <Text>{`${pending ? 'Mining' : ''} ${completed ? 'Mined' : ''} ${label}`}</Text> : null}
      {completed || pending ? null : (
        <Button
          onClick={() => {
            setPending(true)
            transactionFn()
              .then(() => {
                setPending(false)
                setCompleted(true)
              })
              .catch(() => {
                setPending(false)
              })
          }}
          disabled={pending || completed}
          label={`${pending ? 'Mining' : ''} ${completed ? 'Mined' : ''} ${label}`}
        />
      )}
    </>
  )
}

export default TransactionButton
