import React, { ReactElement, useState, useRef } from 'react'
import { Form, Formik } from 'formik'
import { initialPublishFeedback, initialValues } from './_constants'
import { useAccountPurgatory } from '@hooks/useAccountPurgatory'
import { useWeb3 } from '@context/Web3'
import PageHeader from '@shared/Page/PageHeader'
import Title from './Title'
import styles from './index.module.css'
import Actions from './Actions'
import Navigation from './Navigation'
import { Steps } from './Steps'
import { FormPublishData } from './_types'
import { validationSchema } from './_validation'
import { useAbortController } from '@hooks/useAbortController'

// TODO: restore FormikPersist, add back clear form action
// const formName = 'ocean-publish-form'

export default function PublishPage({
  content
}: {
  content: { title: string; description: string; warning: string }
}): ReactElement {
  const { accountId, web3 } = useWeb3()
  const { isInPurgatory, purgatoryData } = useAccountPurgatory(accountId)
  const scrollToRef = useRef()
  const newAbortController = useAbortController()

  // This `feedback` state is auto-synced into Formik context under `values.feedback`
  // for use in other components. Syncing defined in ./Steps.tsx child component.
  const [feedback, setFeedback] = useState(initialPublishFeedback)

  // Collecting output of each publish step, enabling retry of failed steps
  const [did, setDid] = useState<string>()

  // --------------------------------------------------
  // Orchestrate publishing
  // --------------------------------------------------
  async function handleSubmit(values: FormPublishData) {
    setFeedback((prevState) => ({
      ...prevState,
      '1': {
        ...prevState['1'],
        status: 'active',
        errorMessage: null
      }
    }))
    try {
      // Generate signature
      const { datasetId } = values.datasets
      const msg = `${accountId}${datasetId}`
      const hashedStr = web3.utils.sha3(msg)
      const signature = await web3.eth.sign(hashedStr, accountId)

      const { title, description, authors, keywords } = values.metadata

      // Call publish/ API endpoint
      const resp = await fetch(
        process.env.NEXT_PUBLIC_PROXY_API_URL + `/metadata/datasets/publish`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            address: accountId,
            signature,
            datasetId,
            title,
            description,
            authors,
            keywords
          })
        }
      )

      const data = await resp.json()

      if (!data.error) {
        console.log('[publish] successfully published dataset')
        setFeedback((prevState) => ({
          ...prevState,
          '1': {
            ...prevState['1'],
            status: 'success'
          }
        }))
      } else {
        throw new Error('Failed to publish dataset')
      }
    } catch (error) {
      console.error('[publish] error', error.message)
      setFeedback((prevState) => ({
        ...prevState,
        '1': {
          ...prevState['1'],
          status: 'error',
          errorMessage: error.message
        }
      }))
    }
  }

  return isInPurgatory && purgatoryData ? null : (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={async (values) => {
        // kick off publishing
        await handleSubmit(values)
      }}
    >
      {({ values }) => (
        <>
          <PageHeader
            title={<Title networkId={values.user.chainId} />}
            description={content.description}
          />
          <Form className={styles.form} ref={scrollToRef}>
            <Navigation />
            <Steps feedback={feedback} />
            <Actions scrollToRef={scrollToRef} did={did} />
          </Form>
        </>
      )}
    </Formik>
  )
}
