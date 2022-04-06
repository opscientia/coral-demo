import React, { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'

export default function DragAndDrop(props) {
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
    <div style={myComponentStyle}>
      <section className="container">
        <div {...getRootProps({ className: 'dropzone' })}>
          <input {...getInputProps()} />
          {files.length === 0 && <p>Drop files here</p>}
          {files.length > 0 && files}
        </div>
      </section>
    </div>
  )
}
