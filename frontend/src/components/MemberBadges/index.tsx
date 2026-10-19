import { cn } from '@/lib/utils';
import { BadgeChip } from '@/types/communityFeed';

/** A member's badges as small emoji chips next to their name; the name shows on hover. */
export const MemberBadges = ({ badges, className }: { badges?: BadgeChip[]; className?: string }) => {
  if (!badges?.length) return null;
  return (
    <span className={cn('inline-flex shrink-0 items-center gap-0.5', className)}>
      {badges.map((badge) => (
        <span
          key={badge.id}
          title={badge.name}
          aria-label={badge.name}
          role="img"
          className="flex h-5 w-5 items-center justify-center rounded-full text-[11px] leading-none"
          style={{ backgroundColor: `${badge.color}26` }}
        >
          {badge.emoji}
        </span>
      ))}
    </span>
  );
};
