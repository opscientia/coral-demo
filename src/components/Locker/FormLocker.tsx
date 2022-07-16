import React, { ReactElement, useEffect, FormEvent, ChangeEvent } from 'react'
import { useFormikContext, Field, Form, FormikContextType } from 'formik'
import FormInput from '../@shared/FormInput'
import { LockerFormContent, LockerFormFieldProps, LockerForm } from './_types'
import FormTitle from './FormTitle'
import FormActions from './FormActions'
import styles from './FormLocker.module.css'

const content = {
  title: 'Add a Data Set to Your Data Locker',
  data: [
    {
      name: 'files',
      label: 'File(s)',
      help: 'Drop file(s) here to upload to your data locker.',
      type: 'filesDragAndDrop',
      required: true
    }
  ]
}

export default function FormLocker({
  setError,
  setSuccess
}: {
  setError: React.Dispatch<React.SetStateAction<string>>
  setSuccess: React.Dispatch<React.SetStateAction<string>>
}): ReactElement {
  const {
    status,
    setStatus,
    isValid,
    values,
    setErrors,
    setTouched,
    resetForm,
    validateField,
    setFieldValue
  }: FormikContextType<LockerForm> = useFormikContext()

  // reset form validation on every mount
  useEffect(() => {
    setErrors({})
    setTouched({})

    // setSubmitting(false)
  }, [setErrors, setTouched])

  return (
    <Form
      className={styles.form}
      // do we need this?
      // onChange={() => status === 'empty' && setStatus(null)}
    >
      <FormTitle title={content.title} />

      {content.data.map((field: LockerFormFieldProps) => (
        <Field
          key={field.name}
          {...field}
          options={field.options}
          component={FormInput}
        />
      ))}

      <FormActions setError={setError} setSuccess={setSuccess} />
    </Form>
  )
}
