import React, { ReactElement, useState, useEffect } from 'react'

import { Formik, FormikState } from 'formik'
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
    const formData = new FormData()
    let sumFileSizes = 0
    for (const _file of _files) {
      sumFileSizes += _file.size
      formData.append('data', _file)
      formData.append(_file.name, _file.path) // NOTE: Two files with the same name in different directories will not be distinguished with this approach
    }
    if (sumFileSizes > maxUploadSize) {
      console.log('Files are too large')
      return
    }
    formData.append('address', address)
    formData.append('signature', signature)
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
      const msg = await getSecretMessage()
      const fileHash = web3.utils.sha3(msg)
      const signature = await web3.eth.sign(fileHash, accountId)

      console.log(`Uploading files...`)
      const resp = await uploadFiles(values.files, accountId, signature)
      const respData = await resp.json()
      console.log(`File uploaded successfully: ${!respData.error}`)
      setNewFileUploaded(!newFileUploaded)

      if (resp.status !== 201) {
        setError(respData.error)
        return
      }

      resetForm({
        values: { files: null } as LockerForm,
        status: 'empty'
      })
      // move user's focus to top of screen
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
      setError(undefined)
    } catch (error) {
      setError(error.message)
      console.log(error)
    }
  }

  return (
    <>
      <h2>Data Locker</h2>
      <p>
        NOTICE: All data uploaded here will be publicly available through the{' '}
        <a href="https://ipfs.io/" target="_blank" rel="noreferrer">
          Interplanetary File System (IPFS).
        </a>
      </p>
      {error && <Alert text={error} state="error" />}
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
              <FormLocker />
            </>
          )
        }}
      </Formik>
      <Dashboard newFileUploaded={newFileUploaded} />
    </>
  )
}
