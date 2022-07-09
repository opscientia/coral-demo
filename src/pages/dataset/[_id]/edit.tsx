import React, { ReactElement } from 'react'
import { useRouter } from 'next/router'
import EditPage from '../../../components/Dataset/Edit'
import DatasetProvider from '@context/Dataset'

export default function PageEditAsset(): ReactElement {
  const router = useRouter()
  const { _id } = router.query
  return (
    <DatasetProvider _id={_id as string}>
      <EditPage uri={router.pathname} />
    </DatasetProvider>
  )
}
