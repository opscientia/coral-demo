import React, { useState, useEffect, ReactElement } from 'react'
import { useRouter } from 'next/router'
import Page from '@shared/Page'
import Alert from '@shared/atoms/Alert'
import Loader from '@shared/atoms/Loader'
import { useDataset } from '@context/Dataset'
import DatasetContent from './DatasetContent'

export default function DatasetDetails({ uri }: { uri: string }): ReactElement {
  const router = useRouter()
  const { dataset, title, error, loading } = useDataset()
  const [pageTitle, setPageTitle] = useState<string>()

  useEffect(() => {
    if (!dataset || error) {
      setPageTitle('Could not retrieve dataset')
      return
    }
    setPageTitle(title)
  }, [dataset, error, router, title, uri])

  return dataset && pageTitle !== undefined && !loading ? (
    <Page title={pageTitle} uri={uri}>
      <DatasetContent dataset={dataset} />
    </Page>
  ) : error ? (
    <Page title={pageTitle} noPageHeader uri={uri}>
      <Alert title={pageTitle} text={error} state="error" />
    </Page>
  ) : (
    <Page title={undefined} uri={uri}>
      <Loader />
    </Page>
  )
}
