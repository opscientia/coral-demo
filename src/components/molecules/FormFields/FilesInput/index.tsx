import React, { ReactElement, useState, useEffect } from 'react'
import axios from 'axios'
import { useField } from 'formik'
import { toast } from 'react-toastify'
import FileInfo from './Info'
import DragAndDrop from './DragAndDrop'
import CustomInput from '../URLInput/Input'
import { InputProps } from '../../../atoms/Input'
import { fileinfo } from '../../../../utils/provider'
import { useWeb3 } from '../../../../providers/Web3'
import { getOceanConfig } from '../../../../utils/ocean'
import { useCancelToken } from '../../../../hooks/useCancelToken'

export default function FilesInput(props: InputProps): ReactElement {
  const [field, meta, helpers] = useField(props.name)
  const [isLoading, setIsLoading] = useState(false)
  const [fileUrl, setFileUrl] = useState<string>()
  const [file, setFile] = useState(null)
  const { chainId } = useWeb3()
  const newCancelToken = useCancelToken()

  const estuaryEndpoints = [
    'https://shuttle-4.estuary.tech/content/add',
    'https://shuttle-4.estuary.tech/content/add',
    'https://api.estuary.tech/content/add'
  ]

  function loadFileInfo() {
    const config = getOceanConfig(chainId || 1)

    async function validateUrl() {
      try {
        setIsLoading(true)
        const checkedFile = await fileinfo(
          fileUrl,
          config?.providerUri,
          newCancelToken()
        )
        checkedFile && helpers.setValue([checkedFile])
      } catch (error) {
        toast.error('Could not fetch file info. Please check URL and try again')
        console.error(error.message)
      } finally {
        setIsLoading(false)
      }
    }

    fileUrl && validateUrl()
  }

  useEffect(() => {
    loadFileInfo()
  }, [fileUrl])

  function onFileDrop(file: File) {
    setFile(file)
    // TODO: get CID (to populate text field).
    // Code to generate CID: https://github.com/multiformats/js-multiformats#multihash-hashers
    helpers.setValue('0x0...')
  }

  async function handleButtonClick(e: React.SyntheticEvent, url: string) {
    if (file) {
      // Upload to Estuary
      const formData = new FormData()
      formData.append('data', file)
      fetch('https://shuttle-4.estuary.tech/content/add', {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + process.env.REACT_APP_ESTUARY_KEY
        },
        body: formData
      })
        .then((response) => response.json())
        .then((jsonResponse) => {
          console.log(jsonResponse.toString())
        })
        .catch((error) => console.log('Error:', error))
    } else {
      // hack so the onBlur-triggered validation does not show,
      // like when this field is required
      helpers.setTouched(false)

      // File example 'https://oceanprotocol.com/tech-whitepaper.pdf'
      e.preventDefault()

      // In the case when the user re-add the same URL after it was removed (by accident or intentionally)
      if (fileUrl === url) {
        loadFileInfo()
      }

      setFileUrl(url)
    }
  }

  return (
    <>
      {field?.value && field.value[0] && typeof field.value === 'object' ? (
        <FileInfo name={props.name} file={field.value[0]} />
      ) : (
        <div>
          <CustomInput
            submitText="Add File"
            {...props}
            {...field}
            isLoading={isLoading}
            handleButtonClick={handleButtonClick}
          />
          <DragAndDrop onFileDrop={onFileDrop} />
        </div>
      )}
    </>
  )
}
