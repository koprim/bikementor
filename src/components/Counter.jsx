import { useState } from 'react'
import CounterView from './CounterView'

function Counter() {
  const [count, setCount] = useState(0)

  return (
    <CounterView
      count={count}
      onIncrement={() => setCount((c) => c + 1)}
    />
  )
}

export default Counter
