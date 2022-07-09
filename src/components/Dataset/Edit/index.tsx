import React, { ReactElement, useState, useEffect } from 'react'
import { LoggerInstance } from '@oceanprotocol/lib'
import { useDataset } from '@context/Dataset'
import styles from './index.module.css'
import Tabs from '@shared/atoms/Tabs'
import EditMetadata from './EditMetadata'
import EditComputeDataset from './EditComputeDataset'
import Page from '@shared/Page'
import Loader from '@shared/atoms/Loader'
import { useWeb3 } from '@context/Web3'
import Alert from '@shared/atoms/Alert'

export default function Edit({ uri }: { uri: string }): ReactElement {
  const { asset, error, owner, title } = useDataset()
  const [isCompute, setIsCompute] = useState(false)
  const [pageTitle, setPageTitle] = useState<string>('')
  const { accountId } = useWeb3()

  useEffect(() => {
    if (!asset || error || accountId !== owner) {
      setPageTitle('Edit action not available')
      return
    }
    setIsCompute(asset?.services[0]?.type === 'compute')
  }, [asset, error, title])

  const tabs = [
    {
      title: 'Edit Metadata',
      content: <EditMetadata asset={asset} />
    },
    {
      title: 'Edit Compute Settings',
      content: <EditComputeDataset asset={asset} />,
      disabled: !isCompute
    }
  ].filter((tab) => tab !== undefined)

  return asset &&
    asset?.accessDetails &&
    accountId?.toLowerCase() === owner?.toLowerCase() ? (
    <Page title={pageTitle} noPageHeader uri={uri}>
      <div className={styles.container}>
        <Tabs items={tabs} defaultIndex={0} className={styles.edit} />
      </div>
    </Page>
  ) : asset &&
    asset?.accessDetails &&
    accountId?.toLowerCase() !== owner?.toLowerCase() ? (
    <Page title={pageTitle} noPageHeader uri={uri}>
      <Alert
        title="Edit action available only to asset owner"
        text={error}
        state="error"
      />
    </Page>
  ) : (
    <Page title={pageTitle} noPageHeader uri={uri}>
      <Loader />
    </Page>
  )
}
