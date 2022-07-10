import React, { ReactElement } from 'react'
import MetaItem from './MetaItem'
import styles from './MetaFull.module.css'
import Publisher from '@shared/Publisher'
import { Asset } from '@oceanprotocol/lib'
import { Dataset } from 'src/@types/Dataset'

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
