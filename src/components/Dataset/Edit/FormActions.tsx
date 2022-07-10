import { FormikContextType, useFormikContext } from 'formik'
import React, { ReactElement } from 'react'
import { useDataset } from '@context/Dataset'
import Button from '@shared/atoms/Button'
import styles from './FormActions.module.css'
import Link from 'next/link'

export default function FormActions({
  handleClick
}: {
  handleClick?: () => void
}): ReactElement {
  const { dataset } = useDataset()
  const { isValid }: FormikContextType<Partial<any>> = useFormikContext()

  return (
    <footer className={styles.actions}>
      <Button style="primary" disabled={!isValid} onClick={handleClick}>
        Submit
      </Button>
      <Link href={`/dataset/${dataset?._id}`} key={dataset?._id}>
        Cancel
      </Link>
    </footer>
  )
}
