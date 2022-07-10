import React, { ReactElement } from 'react'
import Link from 'next/link'
import Dotdotdot from 'react-dotdotdot'
import removeMarkdown from 'remove-markdown'
import Publisher from '@shared/Publisher'
import AssetType from '@shared/AssetType'
import NetworkName from '@shared/NetworkName'
import styles from './DatasetTeaser.module.css'
import { getServiceByName } from '@utils/ddo'
import { AssetExtended } from 'src/@types/AssetExtended'
import { Dataset } from 'src/@types/Dataset'

export default function DatasetTeaser({
  dataset
}: {
  dataset: Dataset
}): ReactElement {
  return (
    <article className={`${styles.teaser}`}>
      <Link href={`/dataset/${dataset._id}`}>
        <a className={styles.link}>
          <header className={styles.header}>
            <Dotdotdot clamp={3}>
              <h1 className={styles.title}>{dataset.title}</h1>
            </Dotdotdot>
            {dataset.uploader && (
              <Publisher
                account={dataset.uploader}
                minimal
                className={styles.publisher}
              />
            )}
          </header>

          <div className={styles.content}>
            <Dotdotdot tagName="p" clamp={3}>
              {removeMarkdown(dataset.description?.substring(0, 300) || '')}
            </Dotdotdot>
          </div>
        </a>
      </Link>
    </article>
  )
}
