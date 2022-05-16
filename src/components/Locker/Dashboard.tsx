import React, { ReactElement, useState, useEffect } from 'react'
import Button from '@shared/atoms/Button'
import DataSetTeaser from './DataSetTeaser'
import { useWeb3 } from '@context/Web3'
import { confirmAlert } from 'react-confirm-alert'
import 'react-confirm-alert/src/react-confirm-alert.css'

interface FileMetadata {
  address: string
  filename: string
  cid: string
  requestid: number
}

export default function Dashboard(): ReactElement {
  // const data = useStaticQuery(query)
  const web3Context = useWeb3()
  const [filesMetadata, setFilesMetadata] = useState<FileMetadata[]>()
  const [reloadFiles, setReloadFiles] = useState(false)

  function getAndSetFiles() {
    fetch(
      process.env.NEXT_PUBLIC_RBAC_API_URL +
        `/fileMetadata?address=${web3Context.accountId}`,
      {
        method: 'GET'
      }
    )
      .then((resp) => resp.json())
      .then((files) => {
        setFilesMetadata(files)
      })
  }

  useEffect(() => {
    getAndSetFiles()
  }, [web3Context, reloadFiles])

  function deletePin(requestId: number) {
    const filesMetadataTemp = filesMetadata.slice()
    const newFilesMetadata = filesMetadataTemp.filter(
      (file) => file.requestid !== requestId
    )
    setFilesMetadata(newFilesMetadata)
  }

  // onFinish == callback that can be used to set variables in child buttons
  async function handleClick(event, onFinish: () => void) {
    const deleteFile = async (onClose: () => void) => {
      // Sign url
      const strToSign = `/fileMetadata?address=${web3Context.accountId}&requestid=${event.target.name}`
      const hashedStr = web3Context.web3.utils.sha3(strToSign)
      const signature = await web3Context.web3.eth.sign(
        hashedStr,
        web3Context.accountId
      )
      const urlWithSig =
        process.env.NEXT_PUBLIC_RBAC_API_URL +
        strToSign +
        `&signature=${signature}`

      onClose()

      try {
        const resp = await fetch(urlWithSig, {
          method: 'DELETE'
        })
        const data = await resp.json()
        deletePin(event.target.name)
        setReloadFiles(!reloadFiles)
      } catch (err) {
        console.log(err)
        setReloadFiles(!reloadFiles)
      }
      onFinish()
    }
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div>
            <p>Delete this file?</p>
            <Button style="primary" onClick={() => deleteFile(onClose)}>
              Yes
            </Button>
            <Button
              style="ghost"
              onClick={() => {
                onClose()
                onFinish()
              }}
            >
              No
            </Button>
          </div>
        )
      }
    })
  }

  return (
    <>
      <ul>
        {filesMetadata && filesMetadata.length > 0 ? (
          filesMetadata.map((file) => (
            <li key={file.requestid} style={{ marginBottom: '10px' }}>
              <DataSetTeaser
                filename={file.filename}
                description=""
                cid={file.cid}
                requestId={file.requestid}
                discipline=""
                onClickDelete={handleClick}
              />
            </li>
          ))
        ) : (
          <div>
            <p>Uploaded data sets appear here</p>
          </div>
        )}
      </ul>
    </>
  )
}
