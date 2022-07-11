import { BoxSelectionOption } from '@shared/FormFields/BoxSelection'
import Input from '@shared/FormInput'
import { Field, useFormikContext } from 'formik'
import React, { ReactElement, useEffect } from 'react'
import content from '../../../../content/publish/form.json'
import { getFieldContent } from '../_utils'
import IconDataset from '@images/dataset.svg'
import IconAlgorithm from '@images/algorithm.svg'
import styles from './index.module.css'
import Alert from '@shared/atoms/Alert'
import { useMarketMetadata } from '@context/MarketMetadata'

export default function MetadataFields(): ReactElement {
  return (
    <>
      <Field
        {...getFieldContent('title', content.metadata.fields)}
        component={Input}
        name="metadata.title"
      />
      <Field
        {...getFieldContent('description', content.metadata.fields)}
        component={Input}
        name="metadata.description"
        rows={7}
      />
      <Field
        {...getFieldContent('authors', content.metadata.fields)}
        component={Input}
        name="metadata.authors"
      />
      <Field
        {...getFieldContent('keywords', content.metadata.fields)}
        component={Input}
        name="metadata.keywords"
      />
      <Field
        {...getFieldContent('termsAndConditions', content.metadata.fields)}
        component={Input}
        name="metadata.termsAndConditions"
      />
      <a
        className={styles.termsLink}
        href="/terms"
        rel="noopener noreferrer"
        target="_blank"
      >
        View Terms and Conditions
      </a>
    </>
  )
}
