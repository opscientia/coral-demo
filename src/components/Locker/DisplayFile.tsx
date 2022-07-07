import React, { ReactElement, useState, useEffect } from 'react'
import Modal from '@shared/atoms/Modal'
import MetaItem from '../Asset/AssetContent/MetaItem'
import classNames from 'classnames/bind'
import styles from './Dashboard.module.css'
import { FileData as ChonkyFileData } from 'chonky'

const cx = classNames.bind(styles)

/**
 * Display a dataset_description.json file.
 */
export default function DisplayFile({
  fileData,
  isDialogOpen,
  setIsDialogOpen
}: {
  fileData: ChonkyFileData
  isDialogOpen: boolean
  setIsDialogOpen: (isOpen: boolean) => void
}): ReactElement {
  const [desc, setDesc] = useState()

  // Get file
  useEffect(() => {
    async function getDatasetDescription() {
      const resp = await fetch(
        process.env.NEXT_PUBLIC_PROXY_API_URL +
          '/getDatasetDescription' +
          `?estuaryId=${fileData.estuaryId}`
      )
      return await resp.json()
    }
    getDatasetDescription().then((description) => setDesc(description))
  }, [fileData])

  const styleClasses = cx({
    fileList: true
  })

  return (
    <div className={styleClasses}>
      <Modal
        title={fileData.name}
        isOpen={isDialogOpen}
        onToggleModal={() => setIsDialogOpen(false)}
        style={{ content: { background: 'white' } }}
      >
        {desc &&
          Object.keys(desc).map((key, index) => (
            <div key={index}>
              <MetaItem
                title={key}
                content={
                  <code style={{ marginBottom: '1.1em' }}>{desc[key]}</code>
                }
              />
            </div>
          ))}
      </Modal>
    </div>
  )
}
