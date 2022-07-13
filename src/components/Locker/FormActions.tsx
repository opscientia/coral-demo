import React, { FormEvent, ReactElement, RefObject } from 'react'
import Button from '@shared/atoms/Button'
import Loader from '@shared/atoms/Loader'
import styles from './FormActions.module.css'
import { FormikContextType, useFormikContext } from 'formik'
import { LockerForm } from './_types'
import { useWeb3 } from '@context/Web3'

export default function Actions(): ReactElement {
  const {
    status,
    setStatus,
    values,
    errors,
    isValid,
    isSubmitting,
    setFieldValue
  }: FormikContextType<LockerForm> = useFormikContext()
  const { connect, accountId } = useWeb3()

  // const [field, meta, helpers] = useField(props.name)

  function handleClear(event: React.FormEvent<Element>) {
    event.preventDefault()
    setFieldValue('files', null)
    setStatus('empty')
  }

  return (
    <footer className={styles.actions}>
      {isSubmitting ? (
        <Loader message="Uploading" />
      ) : (
        <>
          {!accountId ? (
            <Button
              type="submit"
              style="primary"
              onClick={async (e) => {
                e.preventDefault()
                await connect()
              }}
            >
              Connect Wallet
            </Button>
          ) : (
            <Button type="submit" style="primary">
              Upload
            </Button>
          )}
          <Button onClick={handleClear} style="ghost">
            Clear
          </Button>
        </>
      )}
    </footer>
  )
}
