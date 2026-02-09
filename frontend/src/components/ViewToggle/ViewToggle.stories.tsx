import type { Meta, StoryObj } from '@storybook/react';
import { ViewToggle } from './index';

const meta: Meta<typeof ViewToggle> = {
  title: 'UI/ViewToggle',
  component: ViewToggle,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ViewToggle>;

export const GridMode: Story = {
  args: {
    mode: 'grid',
    onChange: (mode) => console.log('View mode changed to:', mode),
  },
};

export const TableMode: Story = {
  args: {
    mode: 'table',
    onChange: (mode) => console.log('View mode changed to:', mode),
  },
};
