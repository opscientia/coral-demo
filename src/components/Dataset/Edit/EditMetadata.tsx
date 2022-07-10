import React, { ReactElement, useState } from 'react'
import { Formik } from 'formik'
import {
  LoggerInstance,
  Metadata,
  FixedRateExchange,
  Asset,
  Service
} from '@oceanprotocol/lib'
import { validationSchema, getInitialValues } from './_constants'
import { MetadataEditForm } from './_types'
import { useWeb3 } from '@context/Web3'
import FormEditMetadata from './FormEditMetadata'
import { mapTimeoutStringToSeconds } from '@utils/ddo'
import styles from './index.module.css'
import content from '../../../../content/pages/edit.json'
import { AssetExtended } from 'src/@types/AssetExtended'
import { useAbortController } from '@hooks/useAbortController'
import DebugEditMetadata from './DebugEditMetadata'
import { getOceanConfig } from '@utils/ocean'
import EditFeedback from './EditFeedback'
import { useDataset } from '@context/Dataset'
import { setNftMetadata } from '@utils/nft'
import { sanitizeUrl } from '@utils/url'
import { getEncryptedFiles } from '@utils/provider'

interface Dataset {
  _id?: string
  title?: string
  description?: string
  authors?: string[]
  uploader?: string // blockchain address
  license?: string
  doi?: string
  keywords?: string[]
  published?: boolean
  size?: number
  standard?: {
    bids?: {
      validated?: boolean
      version?: string
      deidentified?: boolean
      modality?: string[]
      tasks?: string[]
      warnings?: string
      errors?: string
    }
  }
  miscellaneous?: any
  chunkIds?: number[]
}

export default function Edit({ dataset }: { dataset: Dataset }): ReactElement {
  const { fetchDataset } = useDataset()
  const { accountId, web3 } = useWeb3()
  const newAbortController = useAbortController()
  const [success, setSuccess] = useState<string>()
  const [error, setError] = useState<string>()
  const hasFeedback = error || success

  // async function handleSubmit(
  //   values: Partial<MetadataEditForm>,
  //   resetForm: () => void
  // ) {
  //   try {
  //     const updatedFiles = asset.services[0].files
  //     const linksTransformed = values.links?.length &&
  //       values.links[0].valid && [sanitizeUrl(values.links[0].url)]
  //     const updatedMetadata: Metadata = {
  //       ...asset.metadata,
  //       name: values.name,
  //       description: values.description,
  //       links: linksTransformed,
  //       author: values.author
  //     }

  //     if (values.files[0]?.url) {
  //       const file = {
  //         nftAddress: asset.nftAddress,
  //         datatokenAddress: asset.services[0].datatokenAddress,
  //         files: [
  //           {
  //             type: 'url',
  //             index: 0,
  //             url: values.files[0].url,
  //             method: 'GET'
  //           }
  //         ]
  //       }
  //     }
  //     // Edit succeeded
  //     setSuccess(content.form.success)
  //     resetForm()
  //   } catch (error) {
  //     LoggerInstance.error(error.message)
  //     setError(error.message)
  //   }
  // }

  return (
    <p>Not implemented yet</p>
    // <Formik
    //   enableReinitialize
    //   initialValues={getInitialValues(
    //     asset?.metadata,
    //     asset?.services[0]?.timeout,
    //     asset?.accessDetails?.price
    //   )}
    //   validationSchema={validationSchema}
    //   onSubmit={async (values, { resetForm }) => {
    //     // move user's focus to top of screen
    //     window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
    //     // kick off editing
    //     await handleSubmit(values, resetForm)
    //   }}
    // >
    //   {({ isSubmitting, values }) =>
    //     isSubmitting || hasFeedback ? (
    //       <EditFeedback
    //         title="Updating Data Set"
    //         error={error}
    //         success={success}
    //         setError={setError}
    //         successAction={{
    //           name: 'View Asset',
    //           onClick: async () => {
    //             await fetchDataset()
    //           },
    //           to: `/dataset/${dataset._id}`
    //         }}
    //       />
    //     ) : (
    //       <>
    //         <p className={styles.description}>{content.description}</p>
    //         <article>
    //           <FormEditMetadata data={content.form.data} />
    //         </article>
    //       </>
    //     )
    //   }
    // </Formik>
  )
}
