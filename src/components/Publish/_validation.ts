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

const validationService = {
  files: Yup.array<{ url: string; valid: boolean }[]>()
    .of(
      Yup.object().shape({
        url: Yup.string().url('Must be a valid URL.').required('Required'),
        valid: Yup.boolean().isTrue().required('File must be valid.')
      })
    )
    .min(1, (param) => `At least one file is required.`)
    .required('Enter a valid URL and click ADD FILE.'),
  links: Yup.array<{ url: string; valid: boolean }[]>()
    .of(
      Yup.object().shape({
        url: Yup.string().url('Must be a valid URL.'),
        // TODO: require valid file only when URL is given
        valid: Yup.boolean()
        // valid: Yup.boolean().isTrue('File must be valid.')
      })
    )
    .nullable()
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
  services: Yup.array().of(Yup.object().shape(validationService))
})
