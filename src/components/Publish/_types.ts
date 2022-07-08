import { ServiceComputeOptions } from '@oceanprotocol/lib'
import { NftMetadata } from '@utils/nft'
import { ReactElement } from 'react'
import { PriceOptions } from 'src/@types/Price'

export interface FormPublishData {
  user: {
    stepCurrent: number
    accountId: string
    chainId: number
  }
  metadata: {
    name: string
    description: string
    author: string
    termsAndConditions: boolean
    tags?: string
  }
  datasets: {
    datasetId: string
  }
  feedback?: PublishFeedback
}

export interface StepContent {
  step: number
  title: string
  component: ReactElement
}

export interface PublishFeedback {
  [key: string]: {
    name: string
    description: string
    status: 'success' | 'error' | 'pending' | 'active' | string
    errorMessage?: string
  }
}
