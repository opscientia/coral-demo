import React, {
  ReactElement,
  useEffect,
  FormEvent,
  ChangeEvent,
  useState
} from 'react'
import { useFormikContext, Field, Form, FormikContextType } from 'formik'
import FormInput from '../@shared/FormInput'
import { LockerFormContent, LockerFormFieldProps, LockerForm } from './_types'
import FormTitle from './FormTitle'
import FormActions from './FormActions'
import styles from './FormLocker.module.css'
import axios from 'axios'
import Link from 'next/link'

const chunkSize = 10 * 1024

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

  // chunking start
  const [dropzoneActive, setDropzoneActive] = useState(false)
  const [files, setFiles] = useState([])
  const [currentFileIndex, setCurrentFileIndex] = useState(null)
  const [lastUploadedFileIndex, setLastUploadedFileIndex] = useState(null)
  const [currentChunkIndex, setCurrentChunkIndex] = useState(null)

  function handleDrop(e) {
    e.preventDefault()
    setFiles([...files, ...e.dataTransfer.files])
  }

  function uploadChunk(readerEvent) {
    const file = files[currentFileIndex]
    const data = readerEvent.target.result
    const params = new URLSearchParams()
    params.set('name', file.name)
    params.set('size', file.size)
    params.set('currentChunkIndex', currentChunkIndex)
    params.set('totalChunks', Math.ceil(file.size / chunkSize).toString())
    const headers = { 'Content-Type': 'application/octet-stream' }
    const url = 'http://localhost:4001/upload?' + params.toString()
    axios.post(url, data, { headers }).then((response) => {
      const file = files[currentFileIndex]
      const filesize = files[currentFileIndex].size
      const chunks = Math.ceil(filesize / chunkSize) - 1
      const isLastChunk = currentChunkIndex === chunks
      if (isLastChunk) {
        file.finalFilename = response.data.finalFilename
        setLastUploadedFileIndex(currentFileIndex)
        setCurrentChunkIndex(null)
      } else {
        setCurrentChunkIndex(currentChunkIndex + 1)
      }
    })
  }

  function readAndUploadCurrentChunk() {
    const reader = new FileReader()
    const file = files[currentFileIndex]
    if (!file) {
      return
    }
    const from = currentChunkIndex * chunkSize
    const to = from + chunkSize
    const blob = file.slice(from, to)
    reader.onload = (e) => uploadChunk(e)
    reader.readAsDataURL(blob)
  }

  useEffect(() => {
    if (lastUploadedFileIndex === null) {
      return
    }
    const isLastFile = lastUploadedFileIndex === files.length - 1
    const nextFileIndex = isLastFile ? null : currentFileIndex + 1
    setCurrentFileIndex(nextFileIndex)
  }, [lastUploadedFileIndex])

  useEffect(() => {
    if (files.length > 0) {
      if (currentFileIndex === null) {
        setCurrentFileIndex(
          lastUploadedFileIndex === null ? 0 : lastUploadedFileIndex + 1
        )
      }
    }
  }, [files.length])

  useEffect(() => {
    if (currentFileIndex !== null) {
      setCurrentChunkIndex(0)
    }
  }, [currentFileIndex])

  useEffect(() => {
    if (currentChunkIndex !== null) {
      readAndUploadCurrentChunk()
    }
  }, [currentChunkIndex])

  return (
    <>
      <Form
        className={styles.form}
        onDragOver={(e) => {
          setDropzoneActive(true)
          e.preventDefault()
        }}
        onDragLeave={(e) => {
          setDropzoneActive(false)
          e.preventDefault()
        }}
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
      <div className="files">
        {files.map((file, fileIndex) => {
          let progress = 0
          if (file.finalFilename) {
            progress = 100
          } else {
            const uploading = fileIndex === currentFileIndex
            const chunks = Math.ceil(file.size / chunkSize)
            if (uploading) {
              progress = Math.round((currentChunkIndex / chunks) * 100)
            } else {
              progress = 0
            }
          }
          return (
            <Link
              className="file"
              href={'http://localhost:4001/uploads/' + file.finalFilename}
            >
              <div className="name">{file.name}</div>
              <div
                className={'progress ' + (progress === 100 ? 'done' : '')}
                style={{ width: progress + '%' }}
              >
                {progress}%
              </div>
            </Link>
          )
        })}
      </div>
    </>
  )
}
