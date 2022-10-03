import React, { ReactElement } from 'react'
import Jellyfish from '@oceanprotocol/art/creatures/jellyfish/jellyfish-grid.svg'
import Copy from '@shared/atoms/Copy'
import styles from './Account.module.css'
import OrcidLogo from '../../../@images/ORCID_iD.svg'
export default function OrcidHeader({
  orcid
}: {
  orcid: string
}): ReactElement {
  return (
    <div className={styles.account}>
      <figure>
        {orcid ? (
          <img
            alt="ORCID logo"
            src="https://info.orcid.org/wp-content/uploads/2019/11/orcid_16x16.png"
            width="16"
            height="16"
          />
        ) : (
          <Jellyfish className={styles.image} />
        )}
      </figure>

      <div>
        {/* <h3 className={styles.name}>{profile?.name}</h3> */}
        {orcid && (
          <code className={styles.accountId} title={orcid}>
            {orcid} <Copy text={'https://orcid.org/' + orcid} />
          </code>
        )}
      </div>
    </div>
  )
}
