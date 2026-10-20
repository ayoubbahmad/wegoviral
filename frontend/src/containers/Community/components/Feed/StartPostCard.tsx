import { BarChart3, ImageIcon, Plus } from 'lucide-react';
import { Card } from '@/components/Card';
import { avatarFor } from '@/lib/utils';
import { CommunityUser } from '@/types/communityFeed';
import { useT } from '@/i18n/provider';

interface StartPostCardProps {
  currentUser?: CommunityUser;
  onOpen: () => void;
}

export const StartPostCard = ({ currentUser, onOpen }: StartPostCardProps) => {
  const t = useT();
  return (
    <Card padding="sm" className="flex items-center gap-3">
      {currentUser && (
        <img
          src={avatarFor(currentUser)}
          alt={currentUser.username}
          className="w-10 h-10 rounded-full border border-border shrink-0"
        />
      )}
      <button
        onClick={onOpen}
        className="h-11 flex-1 rounded-full border border-border bg-secondary/20 px-5 text-start text-sm text-muted-foreground hover:bg-secondary/40 transition-colors"
      >
        {t('feed.start.placeholder')}
      </button>
      <div className="hidden sm:flex items-center gap-1 text-muted-foreground">
        <button onClick={onOpen} title={t('feed.start.addImages')} className="p-2 rounded-lg hover:bg-secondary/50 hover:text-foreground transition-colors">
          <ImageIcon className="w-4 h-4" />
        </button>
        <button onClick={onOpen} title={t('feed.start.createPoll')} className="p-2 rounded-lg hover:bg-secondary/50 hover:text-foreground transition-colors">
          <BarChart3 className="w-4 h-4" />
        </button>
      </div>
      <button
        onClick={onOpen}
        aria-label={t('feed.start.create')}
        className="p-2.5 rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:opacity-90 transition-opacity"
      >
        <Plus className="w-4 h-4" />
      </button>
    </Card>
  );
};
