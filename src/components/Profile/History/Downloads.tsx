import React, { ReactElement } from 'react'
import Table from '@shared/atoms/Table'
import Time from '@shared/atoms/Time'
import AssetTitle from '@shared/AssetList/AssetListTitle'
import { useUserPreferences } from '@context/UserPreferences'
const columns = [
  {
    name: 'Data Set',
    selector: function getAssetRow(row: DownloadedAsset) {
      return <AssetTitle asset={row.asset} />
    }
  },
  {
    name: 'Datatoken',
    selector: function getTitleRow(row: DownloadedAsset) {
      return row.dtSymbol
    }
  },
  {
    name: 'Time',
    selector: function getTimeRow(row: DownloadedAsset) {
      return <Time date={row.timestamp.toString()} relative isUnix />
    }
  }
]

export default function ComputeDownloads({
  accountId
}: {
  accountId: string
}): ReactElement {
  return accountId ? (
    <Table
      columns={columns}
      data={[]}
      paginationPerPage={10}
      isLoading={false}
      emptyMessage={null}
    />
  ) : (
    <div>Please connect your Web3 wallet.</div>
  )
}
