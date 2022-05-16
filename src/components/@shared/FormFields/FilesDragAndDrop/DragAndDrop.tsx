import React, { useCallback } from 'react'
import { useField, FormikContextType, useFormikContext } from 'formik'
import { useDropzone } from 'react-dropzone'
import { LockerForm } from 'src/components/Locker/_types'

export default function DragAndDrop(props) {
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
  const [field, meta, helpers] = useField(props.name)

  const myComponentStyle = {
    textAlign: 'center',
    color: 'blue',
    backgroundColor: 'white',
    padding: '1.0em',
    border: '1px dashed silver'
  }

  const onDrop = useCallback(
    (acceptedFiles) => {
      props.onFileDrop(acceptedFiles[0])
      setStatus(null)
    },
    [props]
  )

  const { getRootProps, getInputProps, acceptedFiles } = useDropzone({
    noClick: true,
    maxFiles: 1,
    onDrop: onDrop
  })
  const files = acceptedFiles.map((file) => <p key={file.path}>{file.path}</p>)

  return (
    <div>
      <section className="container">
        <div
          style={myComponentStyle}
          {...getRootProps({ className: 'dropzone' })}
        >
          <input {...getInputProps()} />
          {status === 'empty' ? <p>Drop file here</p> : files}
        </div>
      </section>
    </div>
  )
}
