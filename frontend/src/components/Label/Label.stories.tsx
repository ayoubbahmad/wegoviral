import type { Meta, StoryObj } from '@storybook/react';
import { Label } from './index';

const meta: Meta<typeof Label> = {
  title: 'UI/Label',
  component: Label,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Label>;

export const Default: Story = {
  args: {
    children: 'Full Name',
  },
};

export const Required: Story = {
  render: (args) => (
    <div className='flex items-center gap-1'>
      <Label {...args} />
      <span className='text-destructive font-black'>*</span>
    </div>
  ),
  args: {
    children: 'Email Address',
  },
};
