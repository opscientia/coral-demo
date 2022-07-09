import React, { ReactElement, useState, useEffect } from 'react'
import Link from 'next'
import { useField, useFormikContext } from 'formik'
import { InputProps } from '@shared/FormInput'
import { FormPublishData } from 'src/components/Publish/_types'
import { LoggerInstance } from '@oceanprotocol/lib'
import { useDataset } from '@context/Dataset'
import { useWeb3 } from '@context/Web3'

interface DatasetMetadata {
  _id?: any
  title?: string
  description?: string
  authors?: string[]
  uploader?: string // blockchain address
  license?: string
  doi?: string
  keywords?: string[]
  published?: boolean
  size?: number
  standard?: {
    bids?: {
      validated?: boolean
      version?: string
      deidentified?: boolean
      modality?: string[]
      tasks?: string[]
      warnings?: string
      errors?: string
    }
  }
  chunkIds?: any[]
}

export default function DatasetInput(props: InputProps): ReactElement {
  const [field, meta, helpers] = useField(props.name)
  const [isLoading, setIsLoading] = useState(false)
  const [datasetsMetadata, setDatasetsMetadata] = useState<DatasetMetadata[]>()
  const { values, setFieldError } = useFormikContext<FormPublishData>()
  const web3Context = useWeb3()

  function getAndSetDatasets() {
    fetch(
      process.env.NEXT_PUBLIC_PROXY_API_URL +
        `/metadata/datasets?address=${web3Context.accountId}`,
      {
        method: 'GET'
      }
    )
      .then((resp) => resp.json())
      .then((datasets) => {
        setDatasetsMetadata(datasets)
      })
  }

  useEffect(() => {
    getAndSetDatasets()
  }, [web3Context])

  function handleClose() {
    helpers.setValue(meta.initialValue)
    helpers.setTouched(false)
  }

  function handleSelect(event: React.ChangeEvent<HTMLSelectElement>) {
    helpers.setValue(event.target.value)
  }

  return (
    <>
      <div>
        {datasetsMetadata && datasetsMetadata.length > 0 ? (
          <select onChange={handleSelect}>
            <option />
            {datasetsMetadata
              .filter((dataset) => !dataset.published)
              .map((dataset) => {
                return dataset._id === field.value ? (
                  <option key={dataset._id} value={dataset._id} selected>
                    {dataset.title}
                  </option>
                ) : (
                  <option key={dataset._id} value={dataset._id}>
                    {dataset.title}
                  </option>
                )
              })}
          </select>
        ) : (
          <p>
            No datasets to publish. You can publish datasets after you have
            uploaded them to your <a href="/locker">Data Locker here</a>.
          </p>
        )}
      </div>
    </>
  )
}
