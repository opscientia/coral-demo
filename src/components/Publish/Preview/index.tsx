import React, { ReactElement, useEffect, useState } from 'react'
import styles from './index.module.css'
import { FormPublishData } from '../_types'
import { useFormikContext } from 'formik'
import DatasetContent from 'src/components/Dataset/DatasetContent'
import { AssetExtended } from 'src/@types/AssetExtended'
import { ZERO_ADDRESS } from '@oceanprotocol/lib'

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

export default function Preview(): ReactElement {
  const [dataset, setDataset] = useState<Dataset>()
  const { values } = useFormikContext<FormPublishData>()

  return (
    <div className={styles.preview}>
      <h2 className={styles.previewTitle}>Preview</h2>

      <h3 className={styles.assetTitle}>{values.metadata.name}</h3>
      {dataset && <DatasetContent dataset={dataset} />}
    </div>
  )
}
