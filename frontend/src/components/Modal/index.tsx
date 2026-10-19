'use client';

import { X } from 'lucide-react';
import { useEffect, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?:
    | 'sm'
    | 'md'
    | 'lg'
    | 'xl'
    | '2xl'
    | '3xl'
    | '4xl'
    | '5xl'
    | '6xl'
    | '7xl'
    | 'full';
}

const subscribeNoop = () => () => {};

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'lg',
}: ModalProps) {
  // Portals need document.body, which only exists in the browser
  const mounted = useSyncExternalStore(subscribeNoop, () => true, () => false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!mounted || !isOpen) return null;

  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
    '5xl': 'max-w-5xl',
    '6xl': 'max-w-6xl',
    '7xl': 'max-w-7xl',
    full: 'max-w-full',
  };

  return createPortal(
    <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200'>
      <div
        className={cn(
          'relative flex max-h-[90vh] w-full flex-col bg-card border border-border rounded-xl shadow-lg animate-in zoom-in-95 duration-200',
          maxWidthClasses[maxWidth],
        )}
      >
        <div className='flex shrink-0 items-center justify-between p-6 border-b border-border'>
          <h2 className='text-xl font-semibold'>{title}</h2>
          <button
            onClick={onClose}
            aria-label='Close'
            className='p-2 rounded-lg hover:bg-secondary transition-colors'
          >
            <X className='w-5 h-5' />
          </button>
        </div>
        <div className='overflow-y-auto p-6'>{children}</div>
      </div>
    </div>,
    document.body,
  );
}
