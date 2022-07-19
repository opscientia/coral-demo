import React, { ReactElement, useEffect, useState } from 'react'
import styles from './index.module.css'
import { FormPublishData } from '../_types'
import { useFormikContext } from 'formik'
import DatasetContent from 'src/components/Dataset/DatasetContent'
import { AssetExtended } from 'src/@types/AssetExtended'
import { ZERO_ADDRESS } from '@oceanprotocol/lib'
import { Dataset } from 'src/@types/Dataset'

export default function Preview(): ReactElement {
  const [dataset, setDataset] = useState<Partial<Dataset>>()
  const { values } = useFormikContext<FormPublishData>()

  useEffect(() => {
    const { title, description, authors, keywords } = values.metadata
    const datasetTemp = {
      title,
      description,
      authors: authors.split(','),
      keywords: keywords.split(',')
    }
    setDataset(datasetTemp)
  }, [values])

  return (
    <div className={styles.preview}>
      <h2 className={styles.previewTitle}>Preview</h2>

      <h3 className={styles.assetTitle}>{values.metadata.title}</h3>
      {dataset && <DatasetContent dataset={dataset} />}
    </div>
  )
}
