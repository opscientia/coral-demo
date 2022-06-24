import React, { ReactElement } from 'react'
import LogoAssetFull from '@oceanprotocol/art/logo/logo.svg'
// import LogoAssetFull from '@images/coral.svg'
// import LogoAsset from '@images/logo-coral.svg'
import LogoAssetBranding from '@images/logo-coral-white.svg'
import styles from './index.module.css'

export interface LogoProps {
  noWordmark?: boolean
  useOcean?: boolean
}

export default function Logo({
  noWordmark,
  useOcean
}: LogoProps): ReactElement {
  return useOcean ? (
    <LogoAssetFull className={styles.logo} />
  ) : (
    <LogoAssetBranding className={styles.brand} />
  )
}
