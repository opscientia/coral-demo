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

const formName = 'data-locker-form'

// const query = graphql`
//   query {
//     data-locker-pins {
//       count
//       results
//     }
//   }
// `

export default function LockerPage(): ReactElement {
  const { debug } = useUserPreferences()
  const { accountId } = useWeb3()
  const { isInPurgatory, purgatoryData } = useAccountPurgatory(accountId)
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

  async function uploadFile(_file: File) {
    const formData = new FormData()
    formData.append('data', _file)
    formData.append('address', accountId)
    let success = false
    try {
      const resp = await fetch(
        `${process.env.NEXT_PUBLIC_RBAC_API_URL}/uploadToEstuary`,
        {
          method: 'POST',
          headers: {
            Authorization: `Basic ${process.env.NEXT_PUBLIC_RBAC_AUTH_TOKEN}`
          },
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
      console.log('Uploading file...')
      const success = await uploadFile(values.file)
      console.log(`File uploaded successfully: ${success}`)

      resetForm({
        values: { file: null } as LockerForm,
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
      <Dashboard />
    </>
  )
}
