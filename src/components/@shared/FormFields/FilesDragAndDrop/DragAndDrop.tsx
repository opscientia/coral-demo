import React, { useCallback } from 'react'
import { useField, FormikContextType, useFormikContext } from 'formik'
import { useDropzone, FileWithPath } from 'react-dropzone'
import { LockerForm } from 'src/components/Locker/_types'

interface DragAndDropProps {
  onFileDrop: (files: FileWithPath[]) => void
}

export default function DragAndDrop(props: DragAndDropProps) {
  const { status, setStatus }: FormikContextType<LockerForm> =
    useFormikContext()

  const myComponentStyle = {
    textAlign: 'center' as const,
    color: 'blue',
    backgroundColor: 'white',
    padding: '1.0em',
    border: '1px dashed silver'
  }
  // const styles = StyleSheet.create({
  //   text: {
  //     textAlign: 'center' as const
  //   }
  // })

  const onDrop = useCallback(
    (acceptedFiles: FileWithPath[]) => {
      props.onFileDrop(acceptedFiles)
      setStatus(null)
    },
    [props]
  )

  const { getRootProps, getInputProps, acceptedFiles } = useDropzone({
    noClick: true,
    // maxFiles: 1,
    onDrop
  })
  const files = acceptedFiles.map((file: FileWithPath) => (
    <p key={file.path}>{file.path}</p>
  ))

  return (
    <div>
      <section className="container">
        <div
          style={myComponentStyle}
          {...getRootProps({ className: 'dropzone' })}
        >
          <input {...getInputProps()} />
          {status === 'empty' ? <p>Drop file(s) here</p> : files}
        </div>
      </section>
    </div>
  )
}
