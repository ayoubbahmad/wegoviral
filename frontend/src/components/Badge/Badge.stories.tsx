import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from './index';
import { Check, Info, AlertTriangle, X, Zap } from 'lucide-react';

const meta: Meta<typeof Badge> = {
  title: 'UI/Badge',
  component: Badge,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'success', 'info', 'warning', 'error'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Primary: Story = {
  args: {
    children: 'Primary Badge',
    variant: 'primary',
  },
};

export const Success: Story = {
  args: {
    children: 'Success',
    variant: 'success',
    icon: Check,
  },
};

export const Information: Story = {
  args: {
    children: 'Information',
    variant: 'info',
    icon: Info,
  },
};

export const Warning: Story = {
  args: {
    children: 'Warning',
    variant: 'warning',
    icon: AlertTriangle,
  },
};

export const Error: Story = {
  args: {
    children: 'Error',
    variant: 'error',
    icon: X,
  },
};

export const WithIcon: Story = {
  args: {
    children: 'Feature Badge',
    variant: 'primary',
    icon: Zap,
  },
};
