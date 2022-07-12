import React, { ReactElement, useState, useEffect } from 'react'
import Link from 'next/link'
import Markdown from '@shared/Markdown'
import MetaFull from './MetaFull'
import MetaSecondary from './MetaSecondary'
import { useUserPreferences } from '@context/UserPreferences'
import Bookmark from './Bookmark'
import { useDataset } from '@context/Dataset'
import Alert from '@shared/atoms/Alert'
import DebugOutput from '@shared/DebugOutput'
import MetaMain from './MetaMain'
import styles from './index.module.css'
import content from '../../../../content/purgatory.json'
import { AssetExtended } from 'src/@types/AssetExtended'
import { useWeb3 } from '@context/Web3'
import Web3 from 'web3'
import { Dataset } from 'src/@types/Dataset'

export default function DatasetContent({
  dataset,
  cids
}: {
  dataset: Dataset
  cids: string[]
}): ReactElement {
  const [isOwner, setIsOwner] = useState(false)
  const { accountId } = useWeb3()
  const { owner } = useDataset()
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
  }, [accountId, owner, dataset])

  return (
    <>
      <article className={styles.grid}>
        <div>
          <div className={styles.content}>
            <>
              <Markdown
                className={styles.description}
                text={dataset?.description || ''}
              />
              <MetaSecondary dataset={dataset} />
            </>
            <MetaFull dataset={dataset} cids={cids} />
          </div>
        </div>
      </article>
    </>
  )
}
