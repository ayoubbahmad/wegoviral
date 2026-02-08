import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';
import { Plus, Zap } from 'lucide-react';

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'pill', 'outline', 'ghost', 'secondary', 'floating'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'icon'],
    },
    hoverScale: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    children: 'Primary Button',
    variant: 'primary',
  },
};

export const Pill: Story = {
  args: {
    children: (
      <>
        <Plus className="w-3.5 h-3.5" /> Pill / Rounded Action
      </>
    ),
    variant: 'pill',
  },
};

export const Secondary: Story = {
  args: {
    children: 'Secondary Button',
    variant: 'secondary',
  },
};

export const Outline: Story = {
  args: {
    children: 'Outline Button',
    variant: 'outline',
  },
};

export const Ghost: Story = {
  args: {
    children: 'Ghost Button',
    variant: 'ghost',
  },
};

export const Floating: Story = {
  args: {
    children: <Zap className="w-6 h-6 fill-current" />,
    variant: 'floating',
  },
};

export const Large: Story = {
  args: {
    children: 'Large Button',
    size: 'lg',
  },
};

export const Small: Story = {
  args: {
    children: 'Small Button',
    size: 'sm',
  },
};

export const IconButton: Story = {
  args: {
    children: <Plus className="w-4 h-4" />,
    size: 'icon',
    variant: 'secondary',
  },
};
