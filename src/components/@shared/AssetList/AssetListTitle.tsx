import Link from 'next/link'
import React, { ReactElement, useEffect, useState } from 'react'
import styles from './AssetListTitle.module.css'
import axios from 'axios'
import { Asset } from '@oceanprotocol/lib'
import { useMarketMetadata } from '@context/MarketMetadata'

export default function AssetListTitle({
  asset,
  did,
  title
}: {
  asset?: Asset
  did?: string
  title?: string
}): ReactElement {
  const { appConfig } = useMarketMetadata()
  const [assetTitle, setAssetTitle] = useState<string>(title)

  useEffect(() => {
    if (title || !appConfig.metadataCacheUri) return
    if (asset) {
      setAssetTitle(asset.metadata.name)
    }
  }, [assetTitle, appConfig.metadataCacheUri, asset, did, title])

  return (
    <h3 className={styles.title}>
      <Link href={`/asset/${did || asset?.id}`}>
        <a>{assetTitle}</a>
      </Link>
    </h3>
  )
}
