import { Asset } from '@oceanprotocol/lib'
import AddToken from '@shared/AddToken'
import ExplorerLink from '@shared/ExplorerLink'
import Publisher from '@shared/Publisher'
import React, { ReactElement } from 'react'
import { AssetExtended } from 'src/@types/AssetExtended'
import styles from './MetaAsset.module.css'

export default function MetaAsset({
  asset,
  isBlockscoutExplorer
}: {
  asset: AssetExtended
  isBlockscoutExplorer: boolean
}): ReactElement {
  const dataTokenSymbol = asset?.datatokens[0]?.symbol

  return (
    <div className={styles.wrapper}>
      <span className={styles.owner}>
        Owned by <Publisher account={asset?.nft?.owner} />
      </span>
      <span>
        <ExplorerLink
          className={styles.datatoken}
          networkId={asset?.chainId}
          path={
            isBlockscoutExplorer
              ? `tokens/${asset?.services[0].datatokenAddress}`
              : `token/${asset?.services[0].datatokenAddress}`
          }
        >
          {`Accessed with ${dataTokenSymbol}`}
        </ExplorerLink>
      </span>
    </div>
  )
}
