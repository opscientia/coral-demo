import { ReactElement, useEffect } from 'react'
import { useFormikContext } from 'formik'
import { wizardSteps, initialPublishFeedback } from './_constants'
import { useWeb3 } from '@context/Web3'
import { FormPublishData, PublishFeedback } from './_types'
import { getOceanConfig } from '@utils/ocean'

export function Steps({
  feedback
}: {
  feedback: PublishFeedback
}): ReactElement {
  const { values, setFieldValue, touched, setTouched } =
    useFormikContext<FormPublishData>()

  // auto-sync publish feedback into form data values
  useEffect(() => {
    setFieldValue('feedback', feedback)
  }, [feedback, setFieldValue])

  // auto-switch some feedback content based on pricing type
  useEffect(() => {
    setFieldValue('feedback', {
      ...feedback,
      '1': {
        ...feedback['1'],
        description: initialPublishFeedback['1'].description
      }
    })
  }, [feedback, setFieldValue])

  const { component } = wizardSteps.filter((stepContent) => {
    return stepContent.step === values.user.stepCurrent
  })[0]

  return component
}
