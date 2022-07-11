import React, { ReactElement } from 'react'
import Tooltip from '@shared/atoms/Tooltip'
import styles from './index.module.css'
import content from '../../../../content/publish/index.json'
import { useWeb3 } from '@context/Web3'
import Info from '@images/info.svg'

export default function Title({
  networkId
}: {
  networkId: number
}): ReactElement {
  return <>{content.title} </>
}
