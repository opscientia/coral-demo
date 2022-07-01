import React, { ReactElement } from 'react'
import Tabs from '@shared/atoms/Tabs'
import PoolShares from './PoolShares'
import PoolTransactions from '@shared/PoolTransactions'
import PublishedList from './PublishedList'
import Downloads from './Downloads'
import ComputeJobs from './ComputeJobs'
import styles from './index.module.css'
import { useWeb3 } from '@context/Web3'

interface HistoryTab {
  title: string
  content: JSX.Element
}

function getTabs(accountId: string, userAccountId: string): HistoryTab[] {
  const defaultTabs: HistoryTab[] = [
    {
      title: 'Published',
      content: <PublishedList accountId={accountId} />
    },
    {
      title: 'Downloads',
      content: <Downloads accountId={accountId} />
    }
  ]
  return defaultTabs
}

export default function HistoryPage({
  accountIdentifier
}: {
  accountIdentifier: string
}): ReactElement {
  const { accountId } = useWeb3()

  const url = new URL(location.href)
  const tabs = getTabs(accountIdentifier, accountId)

  const defaultTabIndex = 0

  return (
    <Tabs items={tabs} className={styles.tabs} defaultIndex={defaultTabIndex} />
  )
}
