import React, { ReactElement, useState, useEffect } from 'react'
import { useField, useFormikContext } from 'formik'
import FileInfo from './Info'
import UrlInput from '../URLInput'
import { InputProps } from '@shared/FormInput'
import { getFileUrlInfo } from '@utils/provider'
import { FormPublishData } from 'src/components/Publish/_types'
import { LoggerInstance } from '@oceanprotocol/lib'
import { useAsset } from '@context/Asset'
import { useWeb3 } from '@context/Web3'

interface FileMetadata {
  address: string
  name: string
  cid: string
  estuaryId: number
}

export default function FilesInput(props: InputProps): ReactElement {
  const [field, meta, helpers] = useField(props.name)
  const [isLoading, setIsLoading] = useState(false)
  const [filesMetadata, setFilesMetadata] = useState<FileMetadata[]>()
  const { values, setFieldError } = useFormikContext<FormPublishData>()
  const { asset } = useAsset()
  const web3Context = useWeb3()

  function getAndSetFiles() {
    fetch(
      process.env.NEXT_PUBLIC_PROXY_API_URL +
        `/fileMetadata?address=${web3Context.accountId}`,
      {
        method: 'GET'
      }
    )
      .then((resp) => resp.json())
      .then((files) => {
        setFilesMetadata(files)
      })
  }

  useEffect(() => {
    getAndSetFiles()
  }, [web3Context])

  function handleClose() {
    helpers.setValue(meta.initialValue)
    helpers.setTouched(false)
  }

  function handleSelect(event: React.ChangeEvent<HTMLSelectElement>) {
    // TODO: Make url use gateway? Check Ocean's standards for ipfs hashes as urls.
    helpers.setValue([{ url: event.target.value }])
  }

  return (
    <>
      {field?.value?.[0]?.valid === true ? (
        <FileInfo file={field.value[0]} handleClose={handleClose} />
      ) : (
        <div>
          {filesMetadata && filesMetadata.length > 0 && (
            <select onChange={handleSelect}>
              <option />
              {filesMetadata.map((file) => (
                <option key={file.estuaryId} value={file.cid}>
                  {file.name}
                </option>
              ))}
            </select>
          )}
        </div>
      )}
    </>
  )
}
