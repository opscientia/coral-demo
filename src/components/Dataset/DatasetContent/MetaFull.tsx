import React, { ReactElement, useState, useEffect } from 'react'
import MetaItem from './MetaItem'
import styles from './MetaFull.module.css'
import Publisher from '@shared/Publisher'
import { Asset } from '@oceanprotocol/lib'
import { Dataset } from 'src/@types/Dataset'
import { Author } from 'src/@types/Author'

export default function MetaFull({
  dataset,
  cids,
  authors
}: {
  dataset: Dataset
  cids?: string[]
  authors?: Author[]
}): ReactElement {
  const [cidLinks, setCidsLinks] = useState<ReactElement[]>()

  useEffect(() => {
    if (!cids) return
    setCidsLinks(
      cids.map((cid) => (
        <code key={cid}>
          <a
            href={`https://ipfs.io/ipfs/${cid}`}
            target="_blank"
            rel="noreferrer"
          >
            {`https://ipfs.io/ipfs/${cid}`}
          </a>
        </code>
      ))
    )
  }, [cids])

  return dataset ? (
    <div className={styles.metaFull}>
      {authors?.length > 0 &&
        authors.map((author, index) => (
          <div key={index}>
            <MetaItem title="Author" content={author.name} />
          </div>
        ))}
      {dataset._id && (
        <MetaItem title="_id" content={<code>{dataset?._id}</code>} />
      )}
      {cids &&
        cids.length > 0 &&
        cids.map((cid) => (
          <div key={cid}>
            <MetaItem title="Download Link(s)" content={cidLinks} />
          </div>
        ))}
    </div>
  ) : null
}
