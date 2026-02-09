import type { Meta, StoryObj } from '@storybook/react';
import { Card } from './index';

const meta: Meta<typeof Card> = {
  title: 'UI/Card',
  component: Card,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'glass', 'secondary', 'dashed'],
    },
    padding: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg'],
    },
    hover: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
  args: {
    children: (
      <div className='h-24 flex items-center justify-center'>
        Default Card Content
      </div>
    ),
    variant: 'default',
  },
};

export const Glass: Story = {
  args: {
    children: (
      <div className='h-24 flex items-center justify-center'>
        Glass Card Content
      </div>
    ),
    variant: 'glass',
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
};

export const Secondary: Story = {
  args: {
    children: (
      <div className='h-24 flex items-center justify-center'>
        Secondary Card Content
      </div>
    ),
    variant: 'secondary',
  },
};

export const Dashed: Story = {
  args: {
    children: (
      <div className='h-24 flex items-center justify-center text-muted-foreground italic'>
        Dashed Card Content
      </div>
    ),
    variant: 'dashed',
  },
};

export const WithHover: Story = {
  args: {
    children: (
      <div className='h-24 flex items-center justify-center'>
        Hover enabled Card
      </div>
    ),
    hover: true,
  },
};

export const LargePadding: Story = {
  args: {
    children: (
      <div className='bg-primary/5 h-full w-full flex items-center justify-center'>
        Large Padding
      </div>
    ),
    padding: 'lg',
  },
};
