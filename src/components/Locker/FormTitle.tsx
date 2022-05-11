import React, { ReactElement } from 'react'
import NetworkName from '@shared/NetworkName'
import Tooltip from '@shared/atoms/Tooltip'
import { useWeb3 } from '@context/Web3'
import styles from './FormTitle.module.css'

// Hard-coded content instead of using graphql.
const content = {
  title: 'Locker',
  description: 'Store data here before publishing.',
  warning:
    'Given the beta status, publishing on Ropsten or Rinkeby first is strongly recommended. Please familiarize yourself with [the market](https://oceanprotocol.com/technology/marketplaces), [the risks](https://blog.oceanprotocol.com/on-staking-on-data-in-ocean-market-3d8e09eb0a13), and the [Terms of Use](/terms).',
  tooltipNetwork:
    "Assets are published into the network your wallet is connected to. Switch your wallet's network to publish into another one."
}

const contentTooltip = content.tooltipNetwork

export default function FormTitle({ title }: { title: string }): ReactElement {
  // const data = useStaticQuery(query)
  // const contentTooltip =
  //   data.content.edges[0].node.childPublishJson.tooltipNetwork
  const { networkId } = useWeb3()

  return <h2 className={styles.title}>{title}</h2>
}
