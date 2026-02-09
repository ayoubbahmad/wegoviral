import type { Meta, StoryObj } from '@storybook/react';
import { StatCard } from './index';
import { TrendingUp, Users, Video, Eye } from 'lucide-react';

const meta: Meta<typeof StatCard> = {
  title: 'UI/StatCard',
  component: StatCard,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'glass', 'secondary', 'dashed'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof StatCard>;

export const Standard: Story = {
  args: {
    label: 'Total Views',
    value: '2.4M',
    icon: Eye,
    trend: 12.5,
    description: 'vs last 30 days',
  },
};

export const NegativeTrend: Story = {
  args: {
    label: 'Engagement Rate',
    value: '5.2%',
    icon: TrendingUp,
    trend: -2.4,
    description: 'vs last week',
  },
};

export const GlassVariant: Story = {
  args: {
    label: 'New Subscribers',
    value: '12,840',
    icon: Users,
    trend: 45.2,
    variant: 'glass',
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
};

export const VideoStats: Story = {
  args: {
    label: 'Videos Published',
    value: '48',
    icon: Video,
    variant: 'secondary',
  },
};
