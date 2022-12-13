import React, { ReactElement, useState, useRef } from 'react'
import { Form, Formik } from 'formik'
import PageHeader from '@shared/Page/PageHeader'
import Title from '../components/Publish/Title'
import styles from '../components/Publish/index.module.css'
import { FormPublishData } from '../components/Publish/_types'

// TODO: restore FormikPersist, add back clear form action
// const formName = 'ocean-publish-form'

export default function BlackListPage(): ReactElement {
  // Collecting output of each publish step, enabling retry of failed steps
  const [did, setDid] = useState<string>()

  // --------------------------------------------------
  // Orchestrate publishing
  // --------------------------------------------------
  async function handleSubmit(values: FormPublishData) {
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

import React from 'react'
import { Formik } from 'formik'
import { process } from 'remark'

const Basic = () => (
  <div>
    <h1>Anywhere in your app!</h1>
    <Formik
      initialValues={{ email: '', password: '' }}
      validate={(values) => {
        const errors = {}
        if (!values.email) {
          errors.email = 'Required'
        } else if (
          !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
        ) {
          errors.email = 'Invalid email address'
        }
        return errors
      }}
      onSubmit={(values, { setSubmitting }) => {
        if (values.password === process.env.BLACKLISTPASS)
          setTimeout(() => {
            alert(JSON.stringify(values, null, 2))
            setSubmitting(false)
          }, 400)
      }}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit,
        isSubmitting
        /* and other goodies */
      }) => (
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.email}
          />
          {errors.email && touched.email && errors.email}
          <input
            type="password"
            name="password"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.password}
          />
          {errors.password && touched.password && errors.password}
          <button type="submit" disabled={isSubmitting}>
            Submit
          </button>
        </form>
      )}
    </Formik>
  </div>
)

export default Basic
