import React, { ReactElement } from 'react'
import HistoryPage from './History'
import AccountHeader from './Header'

export default function AccountPage({
  accountId,
  orcid
}: {
  accountId: string
  orcid: string
}): ReactElement {
  return (
    <>
      <AccountHeader accountId={accountId} orcid={orcid} />
      <HistoryPage accountIdentifier={accountId} />
    </>
  )
}
