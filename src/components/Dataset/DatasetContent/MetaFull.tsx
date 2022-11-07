import React, { ReactElement, useState, useEffect } from 'react'
import Link from 'next/link'
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
  const [siblingIds, setSiblingIds] = useState<string[]>()

  useEffect(() => {
    if (!cids) return
    setCidsLinks(
      cids.map((cid) => (
        <code key={cid}>
          <a
            href={`https://api.estuary.tech/gw/ipfs/${cid}`}
            target="_blank"
            rel="noreferrer"
          >
            {`https://api.estuary.tech/gw/ipfs/${cid}`}
          </a>
        </code>
      ))
    )
  }, [cids])

  useEffect(() => {
    if (dataset.miscellaneous?.siblingIds?.length > 0) {
      setSiblingIds(
        dataset.miscellaneous.siblingIds.map((siblingId: string) => (
          <code key={siblingId}>
            <Link href={`/dataset/${siblingId}`}>{siblingId}</Link>
          </code>
        ))
      )
    }
  }, [dataset])

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

      {siblingIds && siblingIds.length > 0 && (
        <MetaItem title="Dataset(s) in Collection" content={siblingIds} />
      )}
      {cids && cids.length > 0 && (
        <MetaItem title="Download Link(s)" content={cidLinks} />
      )}
    </div>
  ) : null
}
