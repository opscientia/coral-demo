import React, { FormEvent, ReactElement, RefObject } from 'react'
import Button from '@shared/atoms/Button'
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
      <>
        <Button type="submit" style="primary">
          Upload
        </Button>
      </>
    </footer>
  )
}
