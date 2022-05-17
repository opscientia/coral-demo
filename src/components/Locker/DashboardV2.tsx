import React, { ReactElement, useState, useEffect, useMemo } from 'react'
import Button from '@shared/atoms/Button'
import DataSetTeaser from './DataSetTeaser'
import { useWeb3 } from '@context/Web3'
import classNames from 'classnames/bind'
import styles from './Dashboard.module.css'
import { confirmAlert } from 'react-confirm-alert'
import 'react-confirm-alert/src/react-confirm-alert.css'

import {
  ChonkyActions,
  ChonkyFileActionData,
  FullFileBrowser,
  FileArray,
  FileBrowser,
  FileContextMenu,
  FileData,
  FileHelper,
  FileList,
  FileNavbar,
  FileToolbar,
  setChonkyDefaults,
  ChonkyIconName
} from 'chonky'
import { ChonkyIconFA } from 'chonky-icon-fontawesome'
setChonkyDefaults({ iconComponent: ChonkyIconFA })

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

  // ------------------------ Start Chonky ------------------------

  // const fileMap = filesMetadata
  //   ? filesMetadata.map((file) => ({
  //       [file.cid]: {
  //         name: file.filename,
  //         id: file.cid
  //       }
  //     }))
  //   : { home: { name: 'sample file', id: 'sampleid' } }
  // const folderChain = [{ name: 'Home', id: 'home' }]

  const [fileMap, setFileMap] = useState({
    home: { name: 'home', id: 'sampleid' }
  })

  useEffect(() => {
    // const newFileMap = structuredClone(fileMap)
    const newFileMap = {
      home: { name: 'home', id: 'sampleid' }
    }
    if (filesMetadata) {
      filesMetadata.map((file) => {
        newFileMap[file.cid] = { name: file.filename, id: file.cid }
      })
    }
    setFileMap(newFileMap)
  }, [filesMetadata])

  const useFiles = (currentFolderId: string): FileArray => {
    return useMemo(() => {
      const currentFolder = fileMap[currentFolderId]
      const files = currentFolder.childrenIds
        ? currentFolder.childrenIds.map(
            (fileId: string) => fileMap[fileId] ?? null
          )
        : []
      return files
    }, [currentFolderId])
  }
  const useFolderChain = (currentFolderId: string): FileArray => {
    return useMemo(() => {
      const currentFolder = fileMap[currentFolderId]
      const folderChain = [currentFolder]
      let { parentId } = currentFolder
      while (parentId) {
        const parentFile = fileMap[parentId]
        if (parentFile) {
          folderChain.unshift(parentFile)
          parentId = parentFile.parentId
        } else {
          parentId = null
        }
      }
      return folderChain
    }, [currentFolderId])
  }

  const [currentFolderId, setCurrentFolderId] = useState('home')
  // const files = useFiles(currentFolderId)
  // const files = [
  //   {
  //     name: 'home',
  //     id: 'sampleid'
  //   }
  // ]
  const [files, setFiles] = useState([])
  useEffect(() => {
    if (filesMetadata) {
      const newFiles = filesMetadata.map((file) => ({
        name: file.filename,
        id: file.cid,
        icon: ChonkyIconName.text
      }))
      setFiles(newFiles)
    }
  }, [filesMetadata])

  const folderChain = useFolderChain(currentFolderId)
  const handleFileAction = (data: ChonkyFileActionData) => {
    if (data.id === ChonkyActions.OpenFiles.id) {
      const { targetFile, files } = data.payload
      const fileToOpen = targetFile ?? files[0]
      if (fileToOpen && FileHelper.isDirectory(fileToOpen)) {
        setCurrentFolderId(fileToOpen.id)
      }
    }
  }

  return (
    <div className={styleClasses}>
      {filesMetadata && filesMetadata.length > 0 ? (
        <div style={{ height: 400 }}>
          <FullFileBrowser files={files} folderChain={folderChain} />
          {/* <FileBrowser
            files={files}
            folderChain={folderChain}
            onFileAction={handleFileAction}
            // thumbnailGenerator={(file: FileData) =>
            //   file.thumbnailUrl ? `https://chonky.io${file.thumbnailUrl}` : null
            // }
          >
            <FileNavbar />
            <FileToolbar />
            <FileList />
            <FileContextMenu />
          </FileBrowser> */}
        </div>
      ) : (
        <div>
          <p>Uploaded data sets appear here</p>
        </div>
      )}
    </div>
  )
}

// const [currentFolderId, setCurrentFolderId] = useState(rootFolderId)
//   const files = useFiles(currentFolderId)
//   const folderChain = useFolderChain(currentFolderId)
//   const handleFileAction = useFileActionHandler(setCurrentFolderId)
//   return (
//     <div style={{ height: 400 }}>
//       <FileBrowser
//         instanceId={props.instanceId}
//         files={files}
//         folderChain={folderChain}
//         onFileAction={handleFileAction}
//         thumbnailGenerator={(file: FileData) =>
//           file.thumbnailUrl ? `https://chonky.io${file.thumbnailUrl}` : null
//         }
//       >
//         <FileNavbar />
//         <FileToolbar />
//         <FileList />
//         <FileContextMenu />
//       </FileBrowser>
//     </div>
//   )
