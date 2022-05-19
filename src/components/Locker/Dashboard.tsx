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
  FileData as ChonkyFileData,
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
  path: string
}

interface FileMap {
  [id: string]: ChonkyFileData
}

/** Example folder file:
  "543d473f1c38" : {
    "childrenCount" : 2,
    "childrenIds" : [
      "d9bcd9d845fe",
      "3c9c725386fd"
    ],
    "id" : "543d473f1c38",
    "isDir" : true,
    "modDate" : "2020-10-24T18:32:19.055Z",
    "name" : "test",
    "parentId" : "08e9a34357a0"
  },
 */
// Get ChonkyFileData object for every folder
function getFolders(_files: ChonkyFileData[]): ChonkyFileData[] {
  // Get all unique folders
  const folders: { [folderPath: string]: ChonkyFileData } = {} // folderPath = e.g., 'xyz/' or 'xyz/abc/'
  for (const file of _files) {
    if (!file.path.includes('/')) continue

    let path = file.path.substring(0, file.path.lastIndexOf('/')) + '/'

    if (path.indexOf('/') === 0) path = path.substring(1) // Remove leading '/'
    console.log(`path: ${path}`)
    console.log(`for file.name: ${file.name}`)
    console.log(`file.path.length: ${file.path.length}`)
    if (!folders[path]) {
      folders[path] = {
        id: path,
        name: path,
        isDir: true
      }
    }
  }
  for (const folderPath of Object.keys(folders)) {
    // Assign every file to a folder
    const childrenIds = _files
      .filter((file) => file.path.includes(folderPath))
      .map((file) => file.id)
    folders[folderPath].childrenIds = childrenIds
    folders[folderPath].childrenCount = childrenIds.length

    // Set parentId for every nested folder
    if (folderPath.replace('/', '').includes('/')) {
      const parentId = folderPath.split('/').splice(0, -1).join('/')
      folders[folderPath].parentId = parentId
    } // Set parentId for every parentless folder to root
    else {
      folders[folderPath].parentId = 'root/'
    }
  }
  return Object.values(folders)
}

// Set parent ids of folder files before calling this function
function setParentIds(_files: ChonkyFileData[]): ChonkyFileData[] {
  for (const file of _files) {
    if (file.isDir) {
      continue
    }
    if (file.path?.includes('/')) {
      const lastIndex = file.path.lastIndexOf('/') + 1
      file.parentId =
        file.path.indexOf('/') === 0
          ? file.path.substring(1, lastIndex)
          : file.path.substring(0, lastIndex)
    } else {
      file.parentId = 'root/'
    }
  }
  return _files
}

// Add 'root' file folder to _files array, and set root.childrenIds to correct array
function addRoot(_files: ChonkyFileData[]): ChonkyFileData[] {
  const childrenIds = []
  for (const file of _files) {
    if (file.parentId === 'root/') {
      childrenIds.push(file.id)
    }
  }
  const root = {
    name: 'root/',
    id: 'root/',
    isDir: true,
    childrenIds: childrenIds,
    childrenCount: childrenIds.length
  }
  _files.push(root)
  return _files
}

function getFileMap(_files: ChonkyFileData[]): FileMap {
  const fileMap: FileMap = {}
  for (const file of _files) {
    fileMap[file.id] = file
  }
  return fileMap
}

export default function Dashboard({ newFileUploaded }): ReactElement {
  const web3Context = useWeb3()
  const [currentFolderId, setCurrentFolderId] = useState<string>('root/')
  const [files, setFiles] = useState<ChonkyFileData[]>()
  const [filesInCurrentDir, setFilesInCurrentDir] = useState<ChonkyFileData[]>()
  const [fileMap, setFileMap] = useState<FileMap>()
  // const folderChain = useFolderChain(currentFolderId)
  const [folderChain, setFolderChain] = useState<ChonkyFileData[]>()
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
      .then((files: FileMetadata[]) => {
        let newFiles: ChonkyFileData[] = files.map((file) => ({
          name: file.filename,
          id: file.cid,
          requestid: file.requestid,
          path: file.path
        }))
        const folders = getFolders(newFiles)
        newFiles.push(...folders)
        newFiles = setParentIds(newFiles)
        newFiles = addRoot(newFiles)
        setFiles(newFiles)
      })
  }

  useEffect(() => {
    getAndSetFiles()
  }, [web3Context, reloadFiles, newFileUploaded])

  useEffect(() => {
    if (files) {
      const newFileMap = getFileMap(files)
      setFileMap(newFileMap)
    }
  }, [files])

  useEffect(() => {
    if (files && fileMap) {
      // Update filesInCurrentDir
      const currentFolder = fileMap[currentFolderId] || fileMap['root/']
      if (currentFolder.childrenCount > 0) {
        const filesTemp = currentFolder.childrenIds.map(
          (fileId: string) => fileMap[fileId] ?? null
        )
        setFilesInCurrentDir(filesTemp)
      }

      // Update folderChain
      const folderChainTemp = [currentFolder]
      let { parentId } = currentFolder
      while (parentId) {
        const parentFile = fileMap[parentId]
        if (parentFile) {
          folderChainTemp.unshift(parentFile)
          // eslint-disable-next-line prefer-destructuring
          parentId = parentFile.parentId
        } else {
          parentId = null
        }
      }
      setFolderChain(folderChainTemp)
    }
  }, [files, fileMap, currentFolderId])

  function removeFileFromDisplay(requestId: number) {
    const filesTemp = files.slice()
    const newFiles = filesTemp.filter((file) => file.requestid !== requestId)
    setFiles(newFiles)
  }

  async function handleClickDelete(_files: ChonkyFileData[]) {
    const deleteFile = async (_file: ChonkyFileData, onClose: () => void) => {
      // Sign url
      const strToSign = `/fileMetadata?address=${web3Context.accountId}&requestid=${_file.requestid}`
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
        removeFileFromDisplay(_file.requestid)
        setReloadFiles(!reloadFiles)
      } catch (err) {
        console.log(err)
        setReloadFiles(!reloadFiles)
      }
    }
    const confirmDelete = (_file: ChonkyFileData) => {
      confirmAlert({
        closeOnEscape: false,
        closeOnClickOutside: false,
        customUI: ({ onClose }) => {
          return (
            <div>
              <p>Delete {_file.name}?</p>
              <Button
                style="primary"
                onClick={() => deleteFile(_file, onClose)}
              >
                Yes
              </Button>
              <Button style="ghost" onClick={onClose}>
                No
              </Button>
            </div>
          )
        }
      })
    }
    for (const f of _files) {
      confirmDelete(f)
    }
  }

  const styleClasses = cx({
    fileList: true
  })

  const handleFileAction = (data: ChonkyFileActionData) => {
    if (data.id === ChonkyActions.DeleteFiles.id) {
      handleClickDelete(data.state.selectedFiles)
    }
    if (data.id === ChonkyActions.OpenFiles.id) {
      const { targetFile, files } = data.payload
      const fileToOpen = targetFile ?? files[0]
      if (fileToOpen && FileHelper.isDirectory(fileToOpen)) {
        setCurrentFolderId(fileToOpen.id)
      }
    }
  }

  const myFileActions = [
    // ChonkyActions.DownloadFiles,
    ChonkyActions.DeleteFiles
  ]

  console.log(files)

  return (
    <div className={styleClasses}>
      {files && files.length > 0 ? (
        <div style={{ height: 400 }}>
          <FullFileBrowser
            files={filesInCurrentDir}
            folderChain={folderChain}
            onFileAction={handleFileAction}
            fileActions={myFileActions}
          />
        </div>
      ) : (
        <div>
          <p>Uploaded data sets appear here</p>
        </div>
      )}
    </div>
  )
}
