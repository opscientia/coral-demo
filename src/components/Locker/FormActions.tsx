import React, { FormEvent, ReactElement, RefObject } from 'react'
import Button from '@shared/atoms/Button'
import Loader from '@shared/atoms/Loader'
import styles from './FormActions.module.css'
import { FormikContextType, useFormikContext } from 'formik'
import { LockerForm } from './_types'

export default function Actions(): ReactElement {
  const {
    values,
    errors,
    isValid,
    isSubmitting,
    setFieldValue
  }: FormikContextType<LockerForm> = useFormikContext()

  return (
    <footer className={styles.actions}>
      {isSubmitting ? (
        <Loader message="Uploading" />
      ) : (
        <Button type="submit" style="primary">
          Upload
        </Button>
      )}
    </footer>
  )
}
