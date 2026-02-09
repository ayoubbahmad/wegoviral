import { ReactNode } from 'react';

export type BadgeVariant =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'info'
  | 'warning'
  | 'error';

export type BadgeShape = 'rounded' | 'pill';

export interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  shape?: BadgeShape;
  icon?: React.ElementType;
  className?: string;
  onClick?: () => void;
}
