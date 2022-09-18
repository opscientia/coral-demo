import React from 'react'
// @ts-expect-error types
import { ComponentStory, ComponentMeta } from '@storybook/react'

import Blockies, { BlockiesProps } from '@shared/atoms/Blockies'

export default {
  title: 'Component/@shared/atoms/Blockies',
  component: Blockies
} as ComponentMeta<typeof Blockies>

const Template: ComponentStory<typeof Blockies> = (
  args: JSX.IntrinsicAttributes & BlockiesProps
) => <Blockies {...args} />

interface Props {
  args: BlockiesProps
}

export const Default: Props = Template.bind({})
Default.args = {
  accountId: '0x1xxxxxxxxxx3Exxxxxx7xxxxxxxxxxxxF1fd'
}
