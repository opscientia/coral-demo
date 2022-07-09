import React, {
  useContext,
  useState,
  useEffect,
  createContext,
  ReactElement,
  useCallback,
  ReactNode
} from 'react'
import { Config, LoggerInstance, Purgatory } from '@oceanprotocol/lib'
import { CancelToken } from 'axios'
import { checkV3Asset, retrieveAsset } from '@utils/aquarius'
import { useWeb3 } from './Web3'
import { useCancelToken } from '@hooks/useCancelToken'
import { getOceanConfig, getDevelopmentConfig } from '@utils/ocean'
import { AssetExtended } from 'src/@types/AssetExtended'
import { useIsMounted } from '@hooks/useIsMounted'
import { useMarketMetadata } from './MarketMetadata'

export interface DatasetProviderValue {
  asset: AssetExtended
  title: string
  owner: string
  error?: string
  loading: boolean
  fetchDataset: () => Promise<void>
}

const DatasetContext = createContext({} as DatasetProviderValue)

function DatasetProvider({
  _id,
  children
}: {
  _id: string
  children: ReactNode
}): ReactElement {
  const { appConfig } = useMarketMetadata()

  const [asset, setAsset] = useState<AssetExtended>()
  const [title, setTitle] = useState<string>()
  const [owner, setOwner] = useState<string>()
  const [error, setError] = useState<string>()
  const [loading, setLoading] = useState(false)

  const isMounted = useIsMounted()

  // -----------------------------------
  // Helper: Get and set dataset based on passed _id
  // -----------------------------------
  const fetchDataset = useCallback(async () => {
    if (!_id) return

    LoggerInstance.log('[dataset] Fetching dataset...')
    setLoading(true)

    const resp = await fetch(
      process.env.NEXT_PUBLIC_PROXY_API_URL +
        `/metadata/datasets/published?id=${_id}`,
      {
        method: 'GET'
      }
    )
    const dataset = await resp.json()

    if (!asset) {
      setError(
        `\`${_id}\`` +
          '\n\nWe could not find a dataset for this _id in the cache. If you just published a new dataset, wait some seconds and refresh this page.'
      )
      LoggerInstance.error(
        `[dataset] Failed getting dataset for ${_id}`,
        dataset
      )
    } else {
      setError(undefined)
      setAsset((prevState) => ({
        ...prevState,
        ...dataset
      }))
      setTitle(dataset.title)
      setOwner(dataset.uploader)
      LoggerInstance.log('[dataset] Got dataset', dataset)
    }

    setLoading(false)
  }, [_id])

  // -----------------------------------
  // 1. Get and set asset based on passed _id
  // -----------------------------------
  useEffect(() => {
    if (!isMounted || !appConfig?.metadataCacheUri) return

    fetchDataset()
  }, [appConfig?.metadataCacheUri, fetchDataset, isMounted])

  return (
    <DatasetContext.Provider
      value={
        {
          asset,
          _id,
          title,
          owner,
          error,
          loading,
          fetchDataset
        } as DatasetProviderValue
      }
    >
      {children}
    </DatasetContext.Provider>
  )
}

// Helper hook to access the provider values
const useDataset = (): DatasetProviderValue => useContext(DatasetContext)

export { DatasetProvider, useDataset, DatasetContext }
export default DatasetProvider
