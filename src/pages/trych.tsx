import React, { useState, useEffect } from 'react'
import axios from 'axios'
const chunkSize = 10 * 1024

function App() {
  const [dropzoneActive, setDropzoneActive] = useState(false)
  const [files, setFiles] = useState([])
  const [currentFileIndex, setCurrentFileIndex] = useState(null)
  const [lastUploadedFileIndex, setLastUploadedFileIndex] = useState(null)
  const [currentChunkIndex, setCurrentChunkIndex] = useState(null)

  function handleDrop(e) {
    e.preventDefault()
    setFiles([...files, ...e.dataTransfer.files])
  }

  const uploadChunk = React.useCallback(
    (readerEvent) => {
      const file = files[currentFileIndex]
      const data = readerEvent.target.result
      const params = new URLSearchParams()
      params.set('name', file.name)
      params.set('size', file.size)
      params.set('currentChunkIndex', currentChunkIndex)
      params.set('totalChunks', Math.ceil(file.size / chunkSize).toString())
      const headers = {
        Authorization: 'Bearer ESTecf3a207-263b-4ef7-8a07-4388a773ce25ARY'
      }
      const url = 'https://upload.estuary.tech/content/add' + params.toString()
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
    },
    [currentChunkIndex, currentFileIndex, files]
  )
  const readAndUploadCurrentChunk = React.useCallback(() => {
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
  }, [currentChunkIndex, currentFileIndex, files, uploadChunk])

  useEffect(() => {
    if (lastUploadedFileIndex === null) {
      return
    }
    const isLastFile = lastUploadedFileIndex === files.length - 1
    const nextFileIndex = isLastFile ? null : currentFileIndex + 1
    setCurrentFileIndex(nextFileIndex)
  }, [currentFileIndex, files.length, lastUploadedFileIndex])

  useEffect(() => {
    if (files.length > 0) {
      if (currentFileIndex === null) {
        setCurrentFileIndex(
          lastUploadedFileIndex === null ? 0 : lastUploadedFileIndex + 1
        )
      }
    }
  }, [currentFileIndex, files.length, lastUploadedFileIndex])

  useEffect(() => {
    if (currentFileIndex !== null) {
      setCurrentChunkIndex(0)
    }
  }, [currentFileIndex])

  useEffect(() => {
    if (currentChunkIndex !== null) {
      readAndUploadCurrentChunk()
    }
  }, [currentChunkIndex, readAndUploadCurrentChunk])

  return (
    <div>
      <div
        onDragOver={(e) => {
          setDropzoneActive(true)
          e.preventDefault()
        }}
        onDragLeave={(e) => {
          setDropzoneActive(false)
          e.preventDefault()
        }}
        onDrop={(e) => handleDrop(e)}
        className={'dropzone' + (dropzoneActive ? ' active' : '')}
      >
        Drop your files here
      </div>
    </div>
  )
}

export default App
