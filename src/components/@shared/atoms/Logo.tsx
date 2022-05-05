import React, { ReactElement } from 'react'
import LogoAssetFull from '@oceanprotocol/art/logo/logo.svg'
import LogoAsset from '@images/logo.svg'
import LogoAssetBranding from '@images/logo-coral-white.svg'
// import LogoAssetBranding from '@images/logo-coral-blk.svg'
import styles from './Logo.module.css'

// export default function Logo({
//   noWordmark
// }: {
//   noWordmark?: boolean
// }): ReactElement {
//   return noWordmark ? (
//     <LogoAsset className={styles.logo} />
//   ) : (
//     <LogoAssetFull className={styles.logo} />
//   )
// }

export default function Logo({
  noWordmark,
  branding
}: {
  noWordmark?: boolean
  branding?: boolean
}): ReactElement {
  return (
    // branding ? (
    <>
      <LogoAssetBranding className={styles.brand} />
    </>
    //   ) : noWordmark ? (
    //     <LogoAsset className={styles.logo} />
    //   ) : (
    //     <LogoAssetFull className={styles.logo} />
    //   )
  )
}
