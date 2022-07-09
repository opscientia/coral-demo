import React, { ReactElement } from 'react'
import { useRouter } from 'next/router'
import PageTemplateDatasetDetails from '../../../components/Dataset'
import DatasetProvider from '@context/Dataset'

export default function PageAssetDetails(): ReactElement {
  const router = useRouter()
  const { _id } = router.query
  return (
    <DatasetProvider _id={_id as string}>
      <PageTemplateDatasetDetails uri={router.asPath} />
    </DatasetProvider>
  )
}
