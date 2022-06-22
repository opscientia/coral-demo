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
  filename: string
  cid: string
  requestid: number
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

  async function handleValidation(e: React.SyntheticEvent, url: string) {
    // File example 'https://oceanprotocol.com/tech-whitepaper.pdf'
    e.preventDefault()

    try {
      const providerUrl = values?.services
        ? values?.services[0].providerUrl.url
        : asset.services[0].serviceEndpoint
      setIsLoading(true)
      const checkedFile = await getFileUrlInfo(url, providerUrl)

      // error if something's not right from response
      if (!checkedFile)
        throw Error('Could not fetch file info. Is your network down?')

      if (checkedFile[0].valid === false)
        throw Error('✗ No valid file detected. Check your URL and try again.')

      // if all good, add file to formik state
      helpers.setValue([{ url, ...checkedFile[0] }])
      console.log('Object.keys(field.value[0])...')
      console.log(Object.keys(field.value[0]))
    } catch (error) {
      setFieldError(`${field.name}[0].url`, error.message)
      LoggerInstance.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  function handleClose() {
    helpers.setValue(meta.initialValue)
    helpers.setTouched(false)
  }

  function handleSelect(event) {
    // TODO: Make url use gateway? Check Ocean's standards for ipfs hashes as urls.
    helpers.setValue([{ url: event.target.value }])
  }

  return (
    <>
      {field?.value?.[0]?.valid === true ? (
        <FileInfo file={field.value[0]} handleClose={handleClose} />
      ) : (
        <div>
          <UrlInput
            submitText="Validate"
            {...props}
            name={`${field.name}[0].url`}
            isLoading={isLoading}
            handleButtonClick={handleValidation}
          />
          {filesMetadata && filesMetadata.length > 0 && (
            <select onChange={handleSelect}>
              <option />
              {filesMetadata.map((file) => (
                <option key={file.requestid} value={file.cid}>
                  {file.filename}
                </option>
              ))}
            </select>
          )}
        </div>
      )}
    </>
  )
}
