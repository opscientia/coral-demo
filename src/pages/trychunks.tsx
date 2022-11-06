import React from 'react'
// import ChunkedUploady from '@rpldy/uploady'
import { ChunkedUploady } from '@rpldy/chunked-uploady'
import Button from '@shared/atoms/Button'
import UploadDropZone from '@rpldy/upload-drop-zone'

export default function TryChunks() {
  function upload(e) {
    e.persist()
    console.log(e.target.files)

    const formData = new FormData()
    formData.append('data', e.target.files[0])

    // NOTE
    // This example uses XMLHttpRequest() instead of fetch
    // because we want to show progress. But you can use
    // fetch in this example if you like.
    const xhr = new XMLHttpRequest()

    xhr.upload.onprogress = (event) => {
      this.setState({
        loaded: event.loaded,
        total: event.total
      })
    }

    xhr.open('POST', 'https://upload.estuary.tech/content/add')
    xhr.setRequestHeader(
      'Authorization',
      'Bearer ESTecf3a207-263b-4ef7-8a07-4388a773ce25ARY'
    )
    xhr.send(formData)
  }

  return (
    <ChunkedUploady
      chunkSize={5120000}
      multiple
      grouped
      maxGroupSize={2}
      method="POST"
      destination={{
        url: 'https://upload.estuary.tech/content/add',
        headers: {
          Authorization: 'Bearer ESTecf3a207-263b-4ef7-8a07-4388a773ce25ARY'
        }
      }}
    >
      <UploadDropZone onDragOverClassName="drag-over">
        <span>Drag&amp;Drop File(s) Here</span>
      </UploadDropZone>
    </ChunkedUploady>
  )
}
