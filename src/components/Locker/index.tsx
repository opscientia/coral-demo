import React, { ReactElement, useState, useEffect } from 'react'

import { Formik, FormikState } from 'formik'
import styles from './index.module.css'
import FormLocker from './FormLocker'
import { validationSchema } from './_validation'
import { LockerForm } from './_types'
import { useUserPreferences } from '@context/UserPreferences'
import { Logger, Metadata } from '@oceanprotocol/lib'
import Debug from './Debug'
import { useAccountPurgatory } from '@hooks/useAccountPurgatory'
import { useWeb3 } from '@context/Web3'
import Dashboard from './Dashboard'
import { FileWithPath } from 'react-dropzone'

const formName = 'data-locker-form'

export default function LockerPage(): ReactElement {
  const { debug } = useUserPreferences()
  const { web3, accountId } = useWeb3()
  const { isInPurgatory, purgatoryData } = useAccountPurgatory(accountId)
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
    // 2 ** 20 * 100 == 100 MiB
    if (sumFileSizes > 2 ** 20 * 100) {
      console.log('Files are too large')
      return
    }
    formData.append('address', address)
    formData.append('signature', signature)
    let success = false
    try {
      const resp = await fetch(
        `${process.env.NEXT_PUBLIC_PROXY_API_URL}/uploadToEstuary`,
        {
          method: 'POST',
          body: formData
        }
      )
      const jsonResponse = await resp.json()
      success = resp.status === 200
    } catch (err) {
      success = false
      console.log(err)
    }
    return success
  }

  async function handleSubmit(
    values: Partial<LockerForm>,
    resetForm: (nextState?: Partial<FormikState<Partial<LockerForm>>>) => void
  ): Promise<void> {
    try {
      console.log('entered handleSubmit')
      console.log(process.env.NEXT_PUBLIC_PROXY_API_URL)
      // TODO: Implement an authentication flow better than just requiring the user to sign first file
      // Sign first file
      const fileAsString = await values.files[0].text()
      const fileHash = web3.utils.sha3(fileAsString)
      const signature = await web3.eth.sign(fileHash, accountId)

      console.log(`Uploading files...`)
      const success = await uploadFiles(values.files, accountId, signature)
      console.log(`File uploaded successfully: ${success}`)
      setNewFileUploaded(!newFileUploaded)

      resetForm({
        values: { files: null } as LockerForm,
        status: 'empty'
      })
      // move user's focus to top of screen
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
    } catch (error) {
      setError(error.message)
      console.log(error)
    }
  }

  return isInPurgatory && purgatoryData ? null : (
    <>
      <h2>Data Locker</h2>
      <p>
        NOTICE: All data uploaded here will be publicly available through the{' '}
        <a href="https://ipfs.io/" target="_blank" rel="noreferrer">
          Interplanetary File System (IPFS).
        </a>
      </p>
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
              {debug === true && <Debug values={values} />}
            </>
          )
        }}
      </Formik>
      <Dashboard newFileUploaded={newFileUploaded} />
    </>
  )
}
