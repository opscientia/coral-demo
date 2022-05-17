import React, { ReactElement, useState, useEffect } from 'react'
import { useField } from 'formik'
import FileInfo from './Info'
import DragAndDrop from './DragAndDrop'
import { InputProps } from '@shared/FormInput'
import { useWeb3 } from '@context/Web3'

export default function FilesDragAndDrop(props: InputProps): ReactElement {
  const [field, meta, helpers] = useField(props.name)
  const web3Context = useWeb3()

  function onFileDrop(_files: File[]) {
    helpers.setValue(_files)
  }

  return (
    <>
      <DragAndDrop {...props} onFileDrop={onFileDrop} />
    </>
  )
}
