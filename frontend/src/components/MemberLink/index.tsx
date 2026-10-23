import Link from 'next/link';
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

/** A member's name or avatar that opens their profile. */
export const MemberLink = ({ username, children, className }: { username: string; children: ReactNode; className?: string }) => (
  <Link href={`/community/members/${username}`} className={cn('hover:underline', className)} onClick={(event) => event.stopPropagation()}>
    {children}
  </Link>
);
