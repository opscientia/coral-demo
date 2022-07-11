import React, { ReactElement } from 'react'
import { useUserPreferences } from '@context/UserPreferences'
import ExplorerLink from '@shared/ExplorerLink'
import Jellyfish from '@oceanprotocol/art/creatures/jellyfish/jellyfish-grid.svg'
import Copy from '@shared/atoms/Copy'
import Blockies from '@shared/atoms/Blockies'
import styles from './Account.module.css'
import { useProfile } from '@context/Profile'

export default function Account({
  accountId
}: {
  accountId: string
}): ReactElement {
  const { chainIds } = useUserPreferences()
  const { profile } = useProfile()

  return (
    <div className={styles.account}>
      <figure className={styles.imageWrap}>
        {accountId ? (
          <Blockies accountId={accountId} className={styles.image} />
        ) : (
          <Jellyfish className={styles.image} />
        )}
      </figure>

      <div>
        <h3 className={styles.name}>{profile?.name}</h3>
        {accountId && (
          <code
            className={styles.accountId}
            title={profile?.accountEns ? accountId : null}
          >
            {profile?.accountEns || accountId} <Copy text={accountId} />
          </code>
        )}
      </div>
    </div>
  )
}
