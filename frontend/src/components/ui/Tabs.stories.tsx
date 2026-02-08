import type { Meta, StoryObj } from '@storybook/react';
import { Tabs } from './Tabs';
import { Palette, Type, MousePointer2, Layout } from 'lucide-react';

const meta: Meta<typeof Tabs> = {
  title: 'UI/Tabs',
  component: Tabs,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Tabs>;

const ITEMS = [
  { id: 'colors', label: 'Colors', icon: Palette },
  { id: 'typography', label: 'Typography', icon: Type },
  { id: 'buttons', label: 'Buttons', icon: MousePointer2 },
  { id: 'cards', label: 'Cards', icon: Layout },
];

export const Default: Story = {
  args: {
    items: ITEMS,
    activeId: 'colors',
    onChange: (id) => console.log('Tab changed to:', id),
  },
};

export const Sticky: Story = {
  args: {
    items: ITEMS,
    activeId: 'buttons',
    sticky: true,
  },
  decorators: [
    (Story) => (
      <div className="h-[200vh] pt-20">
        <p className="text-center mb-8 text-muted-foreground">Scroll down to see sticky behavior</p>
        <Story />
      </div>
    ),
  ],
};
