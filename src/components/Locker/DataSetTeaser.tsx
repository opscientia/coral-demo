import React, { useState } from 'react'
import Dotdotdot from 'react-dotdotdot'
import removeMarkdown from 'remove-markdown'
import Button from '@shared/atoms/Button'
import Loader from '@shared/atoms/Loader'
import styles from '@shared/AssetTeaser/AssetTeaser.module.css'

// Metadata we need: hash, deal ID, filename, [maybe?: provider]

declare type DataSetTeaserProps = {
  filename: string
  description: string
  cid: string
  requestId: number
  discipline: string
  onClickDelete: (event, onFinish: () => void) => Promise<void>
}

const DataSetTeaser: React.FC<DataSetTeaserProps> = ({
  filename,
  description,
  cid,
  requestId,
  discipline,
  onClickDelete
}: DataSetTeaserProps) => {
  // const { attributes } = ddo.findServiceByType('metadata')
  // const { name, type } = attributes.main
  // const { dataTokenInfo } = ddo
  // const isCompute = Boolean(ddo?.findServiceByType('compute'))
  // const accessType = isCompute ? 'compute' : 'access'
  // const { owner } = ddo.publicKey[0]
  const [isDeleting, setIsDeleting] = useState(false)

  return (
    <article className={`${styles.teaser} ${styles.compute}`}>
      {isDeleting ? (
        <Loader message="Deleting file" />
      ) : (
        <div className={styles.link}>
          <header className={styles.header}>
            <div className={styles.symbol}>{filename}</div>
            <Dotdotdot clamp={3}>
              <h1 className={styles.title}>{filename}</h1>
            </Dotdotdot>
            {/* {!noPublisher && (
          <Publisher account={owner} minimal className={styles.publisher} />
        )} */}
          </header>

          {/* <AssetType
        type={type}
        accessType={accessType}
        className={styles.typeDetails}
      /> */}

          <div className={styles.content}>
            <Dotdotdot tagName="p" clamp={3}>
              CID: {removeMarkdown(cid.substring(0, 300) || '')}
            </Dotdotdot>
          </div>

          <footer className={styles.foot}>
            <p>requestId: {requestId}</p>
            <Button
              name={requestId.toString()}
              type="submit"
              onClick={(event) => {
                setIsDeleting(true)
                onClickDelete(event, () => setIsDeleting(false))
              }}
              className={styles.network}
              style="ghost"
            >
              Delete
            </Button>
          </footer>
        </div>
      )}
    </article>
  )
}

export default DataSetTeaser
