import React, { ReactElement } from 'react'
import MetaItem from './MetaItem'
import styles from './MetaSecondary.module.css'
import Tags from '@shared/atoms/Tags'
import Button from '@shared/atoms/Button'
import { Asset } from '@oceanprotocol/lib'

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

export default function MetaSecondary({
  dataset
}: {
  dataset: Dataset
}): ReactElement {
  return (
    <aside className={styles.metaSecondary}>
      {dataset?.keywords?.length > 0 && <Tags items={dataset?.keywords} />}
    </aside>
  )
}
