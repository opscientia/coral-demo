import { MAX_DECIMALS } from '@utils/constants'
import { initialValues } from './_constants'
import * as Yup from 'yup'
import Decimal from 'decimal.js'
import { getMaxDecimalsValidation } from '@utils/numbers'

// TODO: conditional validation
// e.g. when algo is selected, Docker image is required
// hint, hint: https://github.com/jquense/yup#mixedwhenkeys-string--arraystring-builder-object--value-schema-schema-schema

const validationMetadata = {
  name: Yup.string()
    .min(4, (param) => `Title must be at least ${param.min} characters`)
    .required('Required'),
  description: Yup.string()
    .min(10, (param) => `Description must be at least ${param.min} characters`)
    .max(
      5000,
      (param) => `Description must have maximum ${param.max} characters`
    )
    .required('Required'),
  author: Yup.string().required('Required'),
  tags: Yup.string().nullable(),
  termsAndConditions: Yup.boolean()
    .required('Required')
    .isTrue('Please agree to the Terms and Conditions.')
}

const validationDatasets = {
  datasetId: Yup.string().required()
}

// TODO: make Yup.SchemaOf<FormPublishData> work, requires conditional validation
// of all the custom docker image stuff.
// export const validationSchema: Yup.SchemaOf<FormPublishData> =
export const validationSchema: Yup.SchemaOf<any> = Yup.object().shape({
  user: Yup.object().shape({
    stepCurrent: Yup.number(),
    chainId: Yup.number(),
    accountId: Yup.string()
  }),
  metadata: Yup.object().shape(validationMetadata),
  datasets: Yup.object().shape(validationDatasets)
})
