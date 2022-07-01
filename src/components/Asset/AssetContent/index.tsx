import React, { ReactElement, useState, useEffect } from 'react'
import Link from 'next/link'
import Markdown from '@shared/Markdown'
import MetaFull from './MetaFull'
import MetaSecondary from './MetaSecondary'
import AssetActions from '../AssetActions'
import { useUserPreferences } from '@context/UserPreferences'
import Bookmark from './Bookmark'
import { useAsset } from '@context/Asset'
import Alert from '@shared/atoms/Alert'
import DebugOutput from '@shared/DebugOutput'
import MetaMain from './MetaMain'
import EditHistory from './EditHistory'
import styles from './index.module.css'
import NetworkName from '@shared/NetworkName'
import content from '../../../../content/purgatory.json'
import { AssetExtended } from 'src/@types/AssetExtended'
import { useWeb3 } from '@context/Web3'
import Web3 from 'web3'

export default function AssetContent({
  asset
}: {
  asset: AssetExtended
}): ReactElement {
  const [isOwner, setIsOwner] = useState(false)
  const { accountId } = useWeb3()
  const { isInPurgatory, purgatoryData, owner, isAssetNetwork } = useAsset()
  const [receipts, setReceipts] = useState([])
  const [nftPublisher, setNftPublisher] = useState<string>()

  useEffect(() => {
    setNftPublisher(
      Web3.utils.toChecksumAddress(
        receipts?.find((e) => e.type === 'METADATA_CREATED')?.nft?.owner
      )
    )
  }, [receipts])

  useEffect(() => {
    if (!accountId || !owner) return

    const isOwner = accountId.toLowerCase() === owner.toLowerCase()
    setIsOwner(isOwner)
  }, [accountId, owner, asset])

  return (
    <>
      <article className={styles.grid}>
        <div>
          <div className={styles.content}>
            {isInPurgatory === true ? (
              <Alert
                title={content.asset.title}
                badge={`Reason: ${purgatoryData?.reason}`}
                text={content.asset.description}
                state="error"
              />
            ) : (
              <>
                <Markdown
                  className={styles.description}
                  text={asset?.metadata.description || ''}
                />
                <MetaSecondary ddo={asset} />
              </>
            )}
            <MetaFull ddo={asset} />
          </div>
        </div>
      </article>
    </>
  )
}
