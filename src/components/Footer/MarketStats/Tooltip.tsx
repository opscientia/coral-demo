import React, { ReactElement } from 'react'
import NetworkName from '@shared/NetworkName'
import styles from './Tooltip.module.css'
import { StatsValue } from './_types'
import content from '../../../../content/footer.json'
import Markdown from '@shared/Markdown'

export default function MarketStatsTooltip({
  totalValueLockedInOcean,
  poolCount,
  totalOceanLiquidity,
  mainChainIds
}: {
  totalValueLockedInOcean: StatsValue
  poolCount: StatsValue
  totalOceanLiquidity: StatsValue
  mainChainIds: number[]
}): ReactElement {
  return (
    <>
      <ul className={styles.statsList}>
        {mainChainIds?.map((chainId, key) => (
          <li className={styles.tooltipStats} key={key}>
            <NetworkName networkId={chainId} className={styles.network} />
            <br />
            <abbr title="Total Value Locked">TVL</abbr>
            {' | '}
            <strong>{poolCount?.[chainId] || '0'}</strong> pools
            {' | '}
          </li>
        ))}
      </ul>
    </>
  )
}
