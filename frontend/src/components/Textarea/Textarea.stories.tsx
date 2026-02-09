import type { Meta, StoryObj } from '@storybook/react';
import { Textarea } from './index';

const meta: Meta<typeof Textarea> = {
  title: 'UI/Form/Textarea',
  component: Textarea,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Textarea>;

export const Default: Story = {
  args: {
    placeholder: 'Type your message here...',
  },
};

export const WithValue: Story = {
  args: {
    value:
      'This is a multi-line input field optimized for premium creator workflows.',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    value: 'Disabled textarea content.',
  },
};
