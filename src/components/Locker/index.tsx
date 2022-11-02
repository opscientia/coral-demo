import React, { ReactElement, useState, useEffect } from 'react'
import { Formik, FormikState } from 'formik'
import content from '../../../content/pages/locker/index.json'
import styles from './index.module.css'
import FormLocker from './FormLocker'
import { validationSchema } from './_validation'
import { LockerForm } from './_types'
import { useUserPreferences } from '@context/UserPreferences'
import { Logger, Metadata } from '@oceanprotocol/lib'
import { useAccountPurgatory } from '@hooks/useAccountPurgatory'
import Alert from '@shared/atoms/Alert'
import { useWeb3 } from '@context/Web3'
import Dashboard from './Dashboard'
import { FileWithPath } from 'react-dropzone'
import { maxUploadSize } from './_constants'
import useChunkedUploader from 'react-chunked-uploader'

const formName = 'data-locker-form'

export default function LockerPage(): ReactElement {
  const { web3, accountId } = useWeb3()
  const [newFileUploaded, setNewFileUploaded] = useState(false)
  const [success, setSuccess] = useState<string>()
  const [error, setError] = useState<string>()
  const [title, setTitle] = useState<string>()
  const [did, setDid] = useState<string>()
  const [initialFormValues, setInitialFormValues] = useState<
    Partial<LockerForm>
  >(
    (localStorage.getItem(formName) &&
      (JSON.parse(localStorage.getItem(formName))
        .initialValues as LockerForm)) ||
      {}
  )
  const { uploadFile, cancelUpload, isLoading, progress } = useChunkedUploader()

  // Get secret message to sign from proxy server
  async function getSecretMessage() {
    const resp = await fetch(
      `${process.env.NEXT_PUBLIC_PROXY_API_URL}/initializeUpload?address=${accountId}`
    )
    return (await resp.json()).message
  }

  async function uploadFiles(
    _files: FileWithPath[],
    address: string,
    signature: string
  ) {
    console.log('Getting file paths...')
    const formData = new FormData()
    let sumFileSizes = 0
    formData.append('address', address)
    formData.append('signature', signature)
    for (const _file of _files) {
      sumFileSizes += _file.size
      formData.append('data', _file)
      formData.append(_file.name, _file.path) // NOTE: Two files with the same name in different directories will not be distinguished with this approach
    }
    if (sumFileSizes > maxUploadSize) {
      console.log('Files are too large')
      return
    }

    for (const _file of _files) {
      try {
        console.log('chunking file now')
        const result = await uploadFile({
          file: _file,
          url: `${process.env.NEXT_PUBLIC_PROXY_API_URL}/uploadToEstuary`,
          data: formData,
          chunkSize: 10000 // 1MB
        })
        return result
      } catch (error) {
        console.error(error)
      }
    }

    console.log(`Uploading files...`)

    return await fetch(
      `${process.env.NEXT_PUBLIC_PROXY_API_URL}/uploadToEstuary`,
      {
        method: 'POST',
        body: formData
      }
    )
  }

  async function handleSubmit(
    values: Partial<LockerForm>,
    resetForm: (nextState?: Partial<FormikState<Partial<LockerForm>>>) => void
  ): Promise<void> {
    try {
      console.log('entered handleSubmit')
      setSuccess(undefined)
      setError(undefined)
      const msg = await getSecretMessage()
      const fileHash = web3.utils.sha3(msg)
      const signature = await web3.eth.sign(fileHash, accountId)

      const resp = await uploadFiles(values.files, accountId, signature)
      const respData = await resp.json()
      console.log(`File uploaded successfully: ${!respData.error}`)
      setNewFileUploaded(!newFileUploaded)

      if (resp.status !== 201) {
        setSuccess(undefined)
        setError(respData.error)
        return
      }

      resetForm({
        values: { files: null } as LockerForm,
        status: 'empty'
      })
      // move user's focus to top of screen
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
      setSuccess('Dataset successfully uploaded!')
    } catch (error) {
      setSuccess(undefined)
      setError(error.message)
      console.log(error)
    }
  }

  return (
    <>
      <h2>{content.title}</h2>
      <p>{content.description}</p>
      <p>{content.notice}</p>
      {(error || success) && (
        <Alert text={error || success} state={error ? 'error' : 'success'} />
      )}
      <Formik
        initialValues={initialFormValues}
        initialStatus="empty"
        validationSchema={validationSchema}
        onSubmit={async (values, { resetForm }) => {
          await handleSubmit(values, resetForm)
        }}
        enableReinitialize
      >
        {({ values }) => {
          return (
            <>
              <FormLocker setError={setError} setSuccess={setSuccess} />
            </>
          )
        }}
      </Formik>
      <Dashboard newFileUploaded={newFileUploaded} />
    </>
  )
}
