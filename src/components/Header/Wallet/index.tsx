import React, { ReactElement } from 'react'
import Account from './Account'
import Details from './Details'
import Tooltip from '@shared/atoms/Tooltip'
import styles from './index.module.css'
import { useWeb3 } from '@context/Web3'

export default function Wallet(): ReactElement {
  const { accountId, provider, connect, logout } = useWeb3()

  const loggedInView = (
    <>
      <button onClick={logout} className="card">
        Log Out
      </button>

      <div id="console" style={{ whiteSpace: 'pre-line' }}>
        <p style={{ whiteSpace: 'pre-line' }}></p>
      </div>
    </>
  )

  const unloggedInView = (
    <button onClick={connect} className="card">
      Login
    </button>
  )

  return (
    <div className={styles.wallet}>
      <Tooltip
        // content={<Details />}
        trigger="click focus"
        disabled={!accountId}
      >
        {provider ? loggedInView : unloggedInView}
        {/* <Account /> */}
      </Tooltip>
    </div>
  )
}
