import { LoggerInstance } from '@oceanprotocol/lib'
import React, { ReactElement, useEffect, useState, useCallback } from 'react'
import AssetList from '@shared/AssetList'
import DatasetList from '@shared/DatasetList'
import { useUserPreferences } from '@context/UserPreferences'
import styles from './PublishedList.module.css'
import { useCancelToken } from '@hooks/useCancelToken'
import { useMarketMetadata } from '@context/MarketMetadata'
import { CancelToken } from 'axios'
import { Dataset, PagedDatasets } from 'src/@types/Dataset'
import {
  totalAllowedOnPage,
  getDatasetsOnPage
} from 'src/components/Search/utils'

export default function PublishedList({
  accountId
}: {
  accountId: string
}): ReactElement {
  const { appConfig } = useMarketMetadata()

  const [queryResult, setQueryResult] = useState<PagedAssets>()
  const [isLoading, setIsLoading] = useState(false)
  const [page, setPage] = useState<number>(1)
  const [service, setServiceType] = useState<string>()
  const [access, setAccessType] = useState<string>()
  const newCancelToken = useCancelToken()

  async function getDatasets() {
    const resp = await fetch(
      process.env.NEXT_PUBLIC_PROXY_API_URL +
        `/metadata//datasets/published/byUploader?uploader=${accountId}`,
      {
        method: 'GET'
      }
    )
    return await resp.json()
  }

  useEffect(() => {
    async function getResults(): Promise<PagedDatasets> {
      if (!accountId) {
        return
      }
      let pagedDatasets = {
        results: [] as Dataset[],
        page: 0,
        totalPages: 0,
        totalResults: 0
      }
      try {
        const datasets = await getDatasets()
        const datasetsOnPage = getDatasetsOnPage(datasets, page.toString())
        const totalPages = Math.max(
          Math.round(datasets.length / totalAllowedOnPage),
          1
        )
        pagedDatasets = {
          results: datasetsOnPage,
          page: 1,
          totalPages,
          totalResults: datasets.length
        }
      } catch (err) {}
      return pagedDatasets
    }
    getResults().then((results) => setQueryResult(results))
  }, [accountId])

  return accountId ? (
    <>
      {/* <AssetList
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
      /> */}

      <DatasetList
        datasets={queryResult?.results}
        showPagination
        isLoading={isLoading}
        page={queryResult?.page}
        totalPages={queryResult?.totalPages}
        onPageChange={(newPage) => {
          setPage(newPage)
        }}
      />
    </>
  ) : (
    <div>Please connect your Web3 wallet.</div>
  )
}
