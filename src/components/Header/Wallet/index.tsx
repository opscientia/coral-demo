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
      <button onClick={logout}>Log Out</button>

      <div id="console">
        <p></p>
      </div>
    </>
  )

  const loggedOutView = <button onClick={connect}>Login</button>

  return (
    <div className={styles.wallet}>
      {provider ? loggedInView : loggedOutView}
      {/* <Tooltip
        // content={<Details />}
        trigger="click focus"
        disabled={!accountId}
      >
        <Account />
      </Tooltip> */}
    </div>
  )
}
