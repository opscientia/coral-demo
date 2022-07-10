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
import NetworkName from '@shared/NetworkName'
import content from '../../../../content/purgatory.json'
import { AssetExtended } from 'src/@types/AssetExtended'
import { useWeb3 } from '@context/Web3'
import Web3 from 'web3'

interface Dataset {
  _id?: string
  title?: string
  description?: string
  authors?: string[]
  uploader?: string // blockchain address
  license?: string
  doi?: string
  keywords?: string[]
  published?: boolean
  size?: number
  standard?: {
    bids?: {
      validated?: boolean
      version?: string
      deidentified?: boolean
      modality?: string[]
      tasks?: string[]
      warnings?: string
      errors?: string
    }
  }
  miscellaneous?: any
  chunkIds?: number[]
}

export default function DatasetContent({
  dataset
}: {
  dataset: Dataset
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
            <MetaFull dataset={dataset} />
          </div>
        </div>
      </article>
    </>
  )
}
