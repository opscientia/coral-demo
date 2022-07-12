import React, { ReactElement, useState, useEffect, useCallback } from 'react'
import AssetList from '@shared/AssetList'
import DatasetTeaser from '@shared/DatasetTeaser/DatasetTeaser'
import queryString from 'query-string'
import Sort from './sort'
import { getResults, updateQueryStringParameter } from './utils'
import { useUserPreferences } from '@context/UserPreferences'
import { useCancelToken } from '@hooks/useCancelToken'
import styles from './index.module.css'
import { useRouter } from 'next/router'
import { Dataset } from 'src/@types/Dataset'

export default function SearchPage({
  setTotalResults,
  setTotalPagesNumber
}: {
  setTotalResults: (totalResults: number) => void
  setTotalPagesNumber: (totalPagesNumber: number) => void
}): ReactElement {
  const router = useRouter()
  const [parsed, setParsed] = useState<queryString.ParsedQuery<string>>()
  const [queryResult, setQueryResult] = useState<Dataset[]>()
  const [loading, setLoading] = useState<boolean>()
  const [sortType, setSortType] = useState<string>()
  const [sortDirection, setSortDirection] = useState<string>()
  const newCancelToken = useCancelToken()

  // // Commons-specific code
  // const [datasets, setDatasets] = useState<any[]>([])

  // useEffect(() => {
  //   // Commons-specific code
  //   function getAndSetDatasets() {
  //     fetch(
  //       process.env.NEXT_PUBLIC_PROXY_API_URL + `/metadata/datasets/published`,
  //       {
  //         method: 'GET'
  //       }
  //     )
  //       .then((resp) => resp.json())
  //       .then((allDatasets) => setDatasets(allDatasets))
  //   }
  //   getAndSetDatasets()
  // }, [])

  useEffect(() => {
    const parsed = queryString.parse(location.search)
    const { sort, sortOrder } = parsed
    setParsed(parsed)
    setSortDirection(sortOrder as string)
    setSortType(sort as string)
  }, [router])

  const updatePage = useCallback(
    (page: number) => {
      const { pathname, query } = router
      const newUrl = updateQueryStringParameter(
        pathname +
          '?' +
          JSON.stringify(query)
            .replace(/"|{|}/g, '')
            .replace(/:/g, '=')
            .replace(/,/g, '&'),
        'page',
        `${page}`
      )
      return router.push(newUrl)
    },
    [router]
  )

  const fetchDatasets = useCallback(
    async (parsed: queryString.ParsedQuery<string>) => {
      setLoading(true)
      setTotalResults(undefined)
      const queryResult = await getResults(parsed, newCancelToken())
      setQueryResult(queryResult)

      setTotalResults(queryResult?.length || 0)
      // setTotalPagesNumber(queryResult?.totalPages || 0)
      setLoading(false)
    },
    [newCancelToken, setTotalPagesNumber, setTotalResults]
  )
  // useEffect(() => {
  //   if (!parsed || !queryResult) return
  //   const { page } = parsed
  //   if (queryResult.totalPages < Number(page)) updatePage(1)
  // }, [parsed, queryResult, updatePage])

  useEffect(() => {
    if (!parsed) return
    fetchDatasets(parsed)
  }, [parsed, newCancelToken, fetchDatasets])

  return (
    <>
      {/* <div className={styles.search}>
        <div className={styles.row}>
          <Sort
            sortType={sortType}
            sortDirection={sortDirection}
            setSortType={setSortType}
            setSortDirection={setSortDirection}
          />
        </div>
      </div> */}
      <div className={styles.results}>
        {queryResult &&
          queryResult.length > 0 &&
          queryResult.map((dataset) => (
            <div key={dataset._id}>
              <DatasetTeaser dataset={dataset} />
            </div>
          ))}
        {/* <AssetList
          assets={queryResult?.results}
          showPagination
          isLoading={loading}
          page={queryResult?.page}
          totalPages={queryResult?.totalPages}
          onPageChange={updatePage}
        /> */}
      </div>
    </>
  )
}
