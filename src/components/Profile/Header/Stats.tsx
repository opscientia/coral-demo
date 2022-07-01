import { LoggerInstance } from '@oceanprotocol/lib'
import React, { useEffect, useState, ReactElement } from 'react'
import { useUserPreferences } from '@context/UserPreferences'
import { getAccountLiquidityInOwnAssets } from '@utils/subgraph'
import NumberUnit from './NumberUnit'
import styles from './Stats.module.css'
import { useProfile } from '@context/Profile'
import { PoolShares_poolShares as PoolShare } from '../../../@types/subgraph/PoolShares'
import { getAccessDetailsForAssets } from '@utils/accessDetailsAndPricing'
import { calcSingleOutGivenPoolIn } from '@utils/pool'
import Decimal from 'decimal.js'
import { MAX_DECIMALS } from '@utils/constants'

function getPoolSharesLiquidity(poolShares: PoolShare[]): string {
  let liquidity = new Decimal(0)

  for (const poolShare of poolShares) {
    const poolUserLiquidity = calcSingleOutGivenPoolIn(
      poolShare.pool.baseTokenLiquidity,
      poolShare.pool.totalShares,
      poolShare.shares
    )
    liquidity = liquidity.add(new Decimal(poolUserLiquidity))
  }

  return liquidity.toDecimalPlaces(MAX_DECIMALS).toString()
}

export default function Stats({
  accountId
}: {
  accountId: string
}): ReactElement {
  const { chainIds } = useUserPreferences()
  const { assetsTotal } = useProfile()

  return (
    <div className={styles.stats}>
      <NumberUnit label="Published" value={assetsTotal} />
    </div>
  )
}
