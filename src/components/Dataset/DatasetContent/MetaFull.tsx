import React, { ReactElement } from 'react'
import MetaItem from './MetaItem'
import styles from './MetaFull.module.css'
import Publisher from '@shared/Publisher'
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

export default function MetaFull({
  dataset
}: {
  dataset: Dataset
}): ReactElement {
  return dataset ? (
    <div className={styles.metaFull}>
      {dataset?.authors?.length > 0 &&
        dataset?.authors.map((author, index) => (
          <div key={index}>
            <MetaItem title="Author" content={author} />
          </div>
        ))}
      <MetaItem title="_id" content={<code>{dataset?._id}</code>} />
    </div>
  ) : null
}
