import React, { ReactElement } from 'react'
import Status from '@shared/atoms/Status'
import Badge from '@shared/atoms/Badge'
import Tooltip from '@shared/atoms/Tooltip'
import { useWeb3 } from '@context/Web3'
import styles from './Network.module.css'

export default function Network(): ReactElement {
  const { networkId, isTestnet, isSupportedOceanNetwork } = useWeb3()

  return networkId ? (
    <div className={styles.network}>
      {!isSupportedOceanNetwork && (
        <Tooltip content="No Ocean Protocol contracts are deployed to this network.">
          <Status state="error" className={styles.warning} />
        </Tooltip>
      )}
      {isTestnet && <Badge label="Test" className={styles.badge} />}
    </div>
  ) : null
}
