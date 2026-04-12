import styles from './Counter.module.css'

function CounterView({ count, onIncrement }) {
  return (
    <div className={styles.card}>
      <button onClick={onIncrement}>
        count is {count}
      </button>
      <p>
        Edit <code>src/App.jsx</code> and save to test HMR
      </p>
    </div>
  )
}

export default CounterView
