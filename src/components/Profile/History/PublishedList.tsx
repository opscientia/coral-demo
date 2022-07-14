import { LoggerInstance } from '@oceanprotocol/lib'
import React, { ReactElement, useEffect, useState, useCallback } from 'react'
import AssetList from '@shared/AssetList'
import { useUserPreferences } from '@context/UserPreferences'
import styles from './PublishedList.module.css'
import { useCancelToken } from '@hooks/useCancelToken'
import { useMarketMetadata } from '@context/MarketMetadata'
import { CancelToken } from 'axios'

export default function PublishedList({
  accountId
}: {
  accountId: string
}): ReactElement {
  const { appConfig } = useMarketMetadata()
  const { chainIds } = useUserPreferences()

  const [queryResult, setQueryResult] = useState<PagedAssets>()
  const [isLoading, setIsLoading] = useState(false)
  const [page, setPage] = useState<number>(1)
  const [service, setServiceType] = useState<string>()
  const [access, setAccessType] = useState<string>()
  const newCancelToken = useCancelToken()

  return accountId ? (
    <>
      <AssetList
        assets={queryResult?.results}
        isLoading={isLoading}
        showPagination
        page={queryResult?.page}
        totalPages={queryResult?.totalPages}
        onPageChange={(newPage) => {
          setPage(newPage)
        }}
        className={styles.assets}
        noPublisher
      />
    </>
  ) : (
    <div>Please connect your Web3 wallet.</div>
  )
}
