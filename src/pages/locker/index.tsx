import React, { ReactElement } from 'react'
import Locker from '../../components/Locker'
import Page from '@shared/Page'
import content from '../../../content/pages/locker/index.json'
import router from 'next/router'

export default function PageLocker(): ReactElement {
  const { title, description } = content

  return (
    <Page
      title={title}
      description={description}
      uri={router.route}
      noPageHeader
    >
      {/* <Locker content={content} /> */}
      <Locker />
    </Page>
  )
}
