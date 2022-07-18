import React, { ReactElement } from 'react'
import Account from './Account'
import Details from './Details'
import Tooltip from '@shared/atoms/Tooltip'
import styles from './index.module.css'
import { useWeb3 } from '@context/Web3'

export default function Wallet(): ReactElement {
  const { accountId, connect, logout } = useWeb3()

  return (
    <div className={styles.wallet}>
      <Tooltip
        content={<Details />}
        trigger="click focus"
        disabled={!accountId}
      >
        <Account />
      </Tooltip>
    </div>
  )
}
