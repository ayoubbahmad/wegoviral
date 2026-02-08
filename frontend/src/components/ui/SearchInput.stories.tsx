import type { Meta, StoryObj } from '@storybook/react';
import { SearchInput } from './SearchInput';

const meta: Meta<typeof SearchInput> = {
  title: 'UI/SearchInput',
  component: SearchInput,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof SearchInput>;

export const Default: Story = {
  args: {
    placeholder: 'Search for projects...',
  },
};

export const CustomButton: Story = {
  args: {
    placeholder: 'Search scripts...',
    buttonText: 'Find',
  },
};

export const WithValue: Story = {
  args: {
    value: 'AI Automation',
    placeholder: 'Search...',
  },
};
