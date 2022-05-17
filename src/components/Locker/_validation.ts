import * as Yup from 'yup'

import { LockerForm } from './_types'
// import { File as FileMetadata } from '@oceanprotocol/lib'

export const validationSchema: Yup.SchemaOf<LockerForm> = Yup.object()
  .shape({
    // ---- required fields ----
    files: Yup.mixed<File[]>().required('Required')
  })
  .defined()
