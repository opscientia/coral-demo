import React, { ReactElement } from 'react'
import MetaItem from './MetaItem'
import styles from './MetaFull.module.css'
import Publisher from '@shared/Publisher'
import { useAsset } from '@context/Asset'
import { Asset } from '@oceanprotocol/lib'

export default function MetaFull({ ddo }: { ddo: Asset }): ReactElement {
  const { isInPurgatory } = useAsset()

  return ddo ? (
    <div className={styles.metaFull}>
      {!isInPurgatory && (
        <MetaItem title="Data Author" content={ddo?.metadata?.author} />
      )}
      <MetaItem title="DID" content={<code>{ddo?.id}</code>} />
    </div>
  ) : null
}
