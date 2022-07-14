import { useUserPreferences } from '@context/UserPreferences'
import React, { ReactElement, useEffect, useState } from 'react'
import Table from '@shared/atoms/Table'
import { LoggerInstance } from '@oceanprotocol/lib'
import Tooltip from '@shared/atoms/Tooltip'
import AssetTitle from '@shared/AssetList/AssetListTitle'
import { useCancelToken } from '@hooks/useCancelToken'
import { AssetExtended } from 'src/@types/AssetExtended'
import { useWeb3 } from '@context/Web3'
import { useMarketMetadata } from '@context/MarketMetadata'

const columns = [
  {
    name: 'Data Set',
    selector: function getAssetRow(row: AssetExtended) {
      const { metadata } = row
      return <AssetTitle title={metadata.name} asset={row} />
    },
    maxWidth: '45rem',
    grow: 1
  },
  {
    name: 'Datatoken Symbol',
    selector: function getAssetRow(row: AssetExtended) {
      return (
        <Tooltip content={row.datatokens[0].name}>
          <>{row.datatokens[0].symbol}</>
        </Tooltip>
      )
    },
    maxWidth: '10rem'
  }
]

export default function Bookmarks(): ReactElement {
  const { appConfig } = useMarketMetadata()
  const { accountId } = useWeb3()
  const { bookmarks } = useUserPreferences()

  const [pinned, setPinned] = useState<AssetExtended[]>()
  const [isLoading, setIsLoading] = useState<boolean>()
  const { chainIds } = useUserPreferences()
  const newCancelToken = useCancelToken()

  return (
    <Table
      columns={columns}
      data={pinned}
      isLoading={isLoading}
      emptyMessage={
        chainIds.length === 0
          ? 'No network selected'
          : 'Your bookmarks will appear here.'
      }
      noTableHead
    />
  )
}
