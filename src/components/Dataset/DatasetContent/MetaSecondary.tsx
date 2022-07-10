import React, { ReactElement } from 'react'
import MetaItem from './MetaItem'
import styles from './MetaSecondary.module.css'
import Tags from '@shared/atoms/Tags'
import Button from '@shared/atoms/Button'
import { Asset } from '@oceanprotocol/lib'
import { Dataset } from 'src/@types/Dataset'

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
