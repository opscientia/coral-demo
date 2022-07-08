import React, { ReactElement, useState, useEffect, useMemo } from 'react'
import Button from '@shared/atoms/Button'
import { useWeb3 } from '@context/Web3'
import DisplayFile from './DisplayFile'
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
  name: string
  cid: string
  estuaryId: number
  path: string
}

interface FileMap {
  [id: string]: ChonkyFileData
}

/** Example Chonky folder file:
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
function addFolders(_files: ChonkyFileData[]): ChonkyFileData[] {
  // Get all unique folders
  const folders: { [folderPath: string]: ChonkyFileData } = {} // folderPath = e.g., 'xyz/' or 'xyz/abc/'
  for (const file of _files) {
    if (!file.path || !file.path.includes('/')) continue

    let path = file.path.substring(0, file.path.lastIndexOf('/')) + '/'

    if (path.indexOf('/') === 0) path = path.substring(1) // Remove leading '/'

    while (path) {
      if (!folders[path]) {
        folders[path] = {
          id: path,
          name: path.substring(0, path.length - 1),
          path,
          isDir: true,
          isDatasetRoot: false,
          estuaryId: file.estuaryId
        }
      }
      const oldPath = path
      path = path
        .split('/')
        .filter((pathTemp) => pathTemp)
        .slice(0, -1)
        .join('/')
      if (path) {
        path += '/'
        folders[oldPath].parentId = path
      }
    }
  }
  _files.push(...Object.values(folders))
  for (const file of _files) {
    if (!file.isDir) continue
    // Assign every file to a folder
    const childrenIds = _files
      .filter((file) => file.path === file.path.replace(file.name, ''))
      .map((file) => file.id)
    file.childrenIds = childrenIds
    file.childrenCount = childrenIds.length

    // Set parentId to root/ for every dataset root directory
    if (!file.path.replace('/', '').includes('/')) {
      file.parentId = 'root/'
      file.isDatasetRoot = true // used when deleting entire dataset
    }
  }
  return _files
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
    }
    // else {
    //   file.parentId = 'root/'
    //   file.isDatasetRoot = true // used when deleting entire dataset
    // }
  }
  return _files
}

function setChildIds(_files: ChonkyFileData[]): ChonkyFileData[] {
  for (const file of _files) {
    const childrenIds = _files
      .filter(({ parentId }) => parentId === file.id)
      .map(({ id }) => id)
    file.childrenIds = childrenIds
    file.childrenCount = childrenIds.length
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
    id: 'root/',
    name: 'root',
    isDir: true,
    childrenIds,
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

export default function Dashboard({
  newFileUploaded
}: {
  newFileUploaded: boolean
}): ReactElement {
  const web3Context = useWeb3()
  const [currentFolderId, setCurrentFolderId] = useState<string>('root/')
  const [files, setFiles] = useState<ChonkyFileData[]>()
  const [filesInCurrentDir, setFilesInCurrentDir] = useState<ChonkyFileData[]>()
  const [fileMap, setFileMap] = useState<FileMap>()
  // const folderChain = useFolderChain(currentFolderId)
  const [folderChain, setFolderChain] = useState<ChonkyFileData[]>()
  const [reloadFiles, setReloadFiles] = useState(false) // Files are refetched every time this changes
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [fileToDisplay, setFileToDisplay] = useState<ChonkyFileData>()

  function getAndSetFiles() {
    fetch(
      process.env.NEXT_PUBLIC_PROXY_API_URL +
        `/metadata/files?address=${web3Context.accountId}`,
      {
        method: 'GET'
      }
    )
      .then((resp) => resp.json())
      .then((files: FileMetadata[]) => {
        let newFiles: ChonkyFileData[] = files.map((file) => ({
          name: file.name,
          id: file.path,
          estuaryId: file.estuaryId,
          path: file.path,
          isDatasetRoot: false
        }))
        newFiles = addFolders(newFiles)
        newFiles = setParentIds(newFiles)
        newFiles = setChildIds(newFiles)
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
        const filesTemp = currentFolder.childrenIds
          .map((fileId: string) => fileMap[fileId] ?? null)
          .filter((_file: ChonkyFileData) => !!_file)
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

  function removeFileFromDisplay(estuaryId: number) {
    const filesTemp = files.slice()
    const newFiles = filesTemp.filter((file) => file.estuaryId !== estuaryId)
    setFiles(newFiles)
  }

  async function handleClickDelete(_files: ChonkyFileData[]) {
    const deleteFiles = async (
      _files: ChonkyFileData[],
      onClose: () => void
    ) => {
      const rootDirs = _files.filter((_file) => _file.isDatasetRoot)
      const filesToDeleteInRootDirs = _files.filter((_file) => {
        for (const dir of rootDirs) {
          if (_file.id.includes(dir.id)) return true
        }
        return false
      })
      const onlyDeletingRootDirs =
        filesToDeleteInRootDirs.length === _files.length
      if (!onlyDeletingRootDirs) {
        console.log(
          'Trying to delete non-root file or directory. Operation not allowed.'
        )
      } else {
        _files = _files.filter((_file) => _file.isDatasetRoot)
      }
      for (const _file of _files) {
        // Sign url. If URL does not include path to file, the whole dataset will be deleted
        const strToSign = `/metadata/files?address=${web3Context.accountId}&estuaryId=${_file.estuaryId}`
        // if (!_file.isDatasetRoot) strToSign += `&path=${_file.path}`
        const hashedStr = web3Context.web3.utils.sha3(strToSign)
        const signature = await web3Context.web3.eth.sign(
          hashedStr,
          web3Context.accountId
        )
        const urlWithSig =
          process.env.NEXT_PUBLIC_PROXY_API_URL +
          strToSign +
          `&signature=${signature}`

        onClose()

        try {
          const resp = await fetch(urlWithSig, {
            method: 'DELETE'
          })
          const data = await resp.json()
          removeFileFromDisplay(_file.estuaryId)
          setReloadFiles(!reloadFiles)
        } catch (err) {
          console.log(err)
          setReloadFiles(!reloadFiles)
        }
      }
    }
    // const confirmDelete = (_file: ChonkyFileData, isDatasetRoot: boolean) => {
    const confirmDelete = (_files: ChonkyFileData[]) => {
      confirmAlert({
        closeOnEscape: false,
        closeOnClickOutside: false,
        customUI: ({ onClose }) => {
          return (
            <div>
              <p>Delete the following files?</p>
              <Button
                style="primary"
                onClick={() => deleteFiles(_files, onClose)}
              >
                Yes
              </Button>
              <Button style="ghost" onClick={onClose}>
                No
              </Button>
              <p />
              {_files.map((_file) => (
                <div key={_file.id}>
                  <p>{_file.path}</p>
                </div>
              ))}
            </div>
          )
        }
      })
    }
    const addChildren = (_files: ChonkyFileData[]) => {
      const dirs = _files.filter((_file) => _file.isDir)
      while (dirs.length > 0) {
        for (const childId of dirs[0].childrenIds) {
          const child = fileMap[childId]
          if (child.isDir) {
            dirs.push(child)
          } else {
            _files.push(child)
          }
        }
        dirs.shift()
      }
      return _files
    }
    // pseudocode:
    // if file is not dir, then submit delete request (with path) for it
    // if file is dir (but not root dir), then submit separate delete request for every child file
    // if file is root dir of dataset, then submit delete request containing estuaryId but not path
    _files = addChildren(_files)
    _files = _files.filter((_file) => !_file.isDir || _file.isDatasetRoot) // Remove dirs, except root dir
    confirmDelete(_files)
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
      if (fileToOpen.name.includes('dataset_description.json')) {
        setFileToDisplay(fileToOpen)
        setIsDialogOpen(true)
      }
    }
  }

  const myFileActions = [
    // ChonkyActions.DownloadFiles,
    ChonkyActions.DeleteFiles
  ]

  return (
    <div>
      {fileToDisplay && isDialogOpen && (
        <DisplayFile
          fileData={fileToDisplay}
          isDialogOpen={isDialogOpen}
          setIsDialogOpen={setIsDialogOpen}
        />
      )}
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
