import { chunkUploadSize } from 'src/components/Locker/_constants'

export default function ClientChunkUpload(largeFiles, DirSize) {
  console.log('chunk upload entered')
  console.log(largeFiles[0])
  const myHeaders = new Headers()
  const formdata = new FormData()
  let chunkId
  const NoOfChunks = Math.floor(DirSize / chunkUploadSize)
  for (let i = 0; i < NoOfChunks + 1; i++) {
    chunkId = String(Math.random).substring(2, 5) + Date.now + '_' + i
    myHeaders.append('file-chunk-id', chunkId)
    myHeaders.append('file-chunk-size', chunkUploadSize.toString())
    myHeaders.append('Content-Range', `bytes */${chunkUploadSize}`)
    formdata.append('file', largeFiles[i], chunkId)
    formdata.append(largeFiles[i], largeFiles[i].path)
    fetch(`${process.env.NEXT_PUBLIC_PROXY_API_URL}/handleChunks`, {
      method: 'POST',
      headers: myHeaders,
      body: formdata,
      redirect: 'follow'
    })
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.log('error', error))
  }
}
