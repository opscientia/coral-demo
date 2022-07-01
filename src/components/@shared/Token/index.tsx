import React, { ReactElement } from 'react'
import styles from './index.module.css'
import Logo from '@shared/atoms/Logo'

export default function Token({
  symbol,
  balance,
  conversion,
  noIcon,
  size
}: {
  symbol: string
  balance: string
  conversion?: boolean
  noIcon?: boolean
  size?: 'small' | 'mini'
}): ReactElement {
  return (
    <>
      <div className={`${styles.token} ${size ? styles[size] : ''}`}>
        <figure
          className={`${styles.icon} ${symbol} ${noIcon ? styles.noIcon : ''}`}
        >
          <Logo noWordmark />
        </figure>
      </div>
    </>
  )
}
