import { useEffect, useState } from 'react'

function useSubject(subject) {
  const [value, setValue] = useState(subject.getValue())

  useEffect(() => {
    const subscription = subject.subscribe(newValue => {
      setValue(newValue)
    })
    return () => subscription.unsubscribe()
  }, [])

  return value
}

export default useSubject
