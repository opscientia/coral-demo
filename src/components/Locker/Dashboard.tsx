import React, { ReactElement, useState, useEffect } from 'react'
import Button from '@shared/atoms/Button'
import DataSetTeaser from './DataSetTeaser'
import { useWeb3 } from '@context/Web3'
import classNames from 'classnames/bind'
import styles from './Dashboard.module.css'
import { confirmAlert } from 'react-confirm-alert'
import 'react-confirm-alert/src/react-confirm-alert.css'

const cx = classNames.bind(styles)

interface FileMetadata {
  address: string
  filename: string
  cid: string
  requestid: number
}

export default function Dashboard({ newFileUploaded }): ReactElement {
  // const data = useStaticQuery(query)
  const web3Context = useWeb3()
  const [filesMetadata, setFilesMetadata] = useState<FileMetadata[]>()
  const [reloadFiles, setReloadFiles] = useState(false) // Files are refetched every time this changes

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
  }, [web3Context, reloadFiles, newFileUploaded])

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
      closeOnEscape: false,
      closeOnClickOutside: false,
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

  const styleClasses = cx({
    fileList: true
  })

  return (
    <div className={styleClasses}>
      {filesMetadata && filesMetadata.length > 0 ? (
        filesMetadata.map((file) => (
          <DataSetTeaser
            key={file.requestid}
            filename={file.filename}
            description=""
            cid={file.cid}
            requestId={file.requestid}
            discipline=""
            onClickDelete={handleClick}
          />
        ))
      ) : (
        <div>
          <p>Uploaded data sets appear here</p>
        </div>
      )}
    </div>
  )
}
