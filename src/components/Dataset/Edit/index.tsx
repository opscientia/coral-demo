import React, { ReactElement, useState, useEffect } from 'react'
import { LoggerInstance } from '@oceanprotocol/lib'
import { useDataset } from '@context/Dataset'
import styles from './index.module.css'
import Tabs from '@shared/atoms/Tabs'
// import EditMetadata from './EditMetadata'
import Page from '@shared/Page'
import Loader from '@shared/atoms/Loader'
import { useWeb3 } from '@context/Web3'
import Alert from '@shared/atoms/Alert'

export default function Edit({ uri }: { uri: string }): ReactElement {
  const { dataset, error, owner, title } = useDataset()
  const [pageTitle, setPageTitle] = useState<string>('')
  const { accountId } = useWeb3()

  useEffect(() => {
    if (!dataset || error || accountId !== owner) {
      setPageTitle('Edit action not available')
    }
  }, [dataset, error, title])

  const tabs = [
    {
      title: 'Edit Metadata',
      content: <p>(Edit Metadata has not been implemented yet)</p> // <EditMetadata dataset={dataset} />
    }
  ].filter((tab) => tab !== undefined)

  return dataset && accountId?.toLowerCase() === owner?.toLowerCase() ? (
    <Page title={pageTitle} noPageHeader uri={uri}>
      <div className={styles.container}>
        <Tabs items={tabs} defaultIndex={0} className={styles.edit} />
      </div>
    </Page>
  ) : dataset && accountId?.toLowerCase() !== owner?.toLowerCase() ? (
    <Page title={pageTitle} noPageHeader uri={uri}>
      <Alert
        title="Edit action available only to dataset owner"
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
