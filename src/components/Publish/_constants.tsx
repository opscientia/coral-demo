import React from 'react'
import { allowDynamicPricing, allowFixedPricing } from '../../../app.config.js'
import { FormPublishData, PublishFeedback, StepContent } from './_types'
import content from '../../../content/publish/form.json'
import MetadataFields from './Metadata'
import ServicesFields from './Services'
import Preview from './Preview'
import Submission from './Submission'
import { ServiceComputeOptions } from '@oceanprotocol/lib'
import contentFeedback from '../../../content/publish/feedback.json'

export const wizardSteps: StepContent[] = [
  {
    step: 1,
    title: content.metadata.title,
    component: <MetadataFields />
  },
  {
    step: 2,
    title: content.services.title,
    component: <ServicesFields />
  },
  {
    step: 3,
    title: content.preview.title,
    component: <Preview />
  },
  {
    step: 4,
    title: content.submission.title,
    component: <Submission />
  }
]

export const initialValues: FormPublishData = {
  user: {
    stepCurrent: 1,
    chainId: 1,
    accountId: ''
  },
  metadata: {
    name: '',
    author: '',
    description: '',
    tags: '',
    termsAndConditions: false
  },
  services: [
    {
      files: [{ url: '' }],
      links: [{ url: '' }]
    }
  ]
}

export const initialPublishFeedback: PublishFeedback = contentFeedback
