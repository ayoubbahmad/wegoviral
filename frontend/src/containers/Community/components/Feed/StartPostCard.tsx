import { BarChart3, ImageIcon, Plus } from 'lucide-react';
import { Card } from '@/components/Card';
import { CommunityUser } from '@/types/communityFeed';

interface StartPostCardProps {
  currentUser?: CommunityUser;
  onOpen: () => void;
}

export const StartPostCard = ({ currentUser, onOpen }: StartPostCardProps) => {
  return (
    <Card padding="sm" className="flex items-center gap-3">
      {currentUser && (
        <img
          src={currentUser.avatarUrl}
          alt={currentUser.username}
          className="w-10 h-10 rounded-full border border-border shrink-0"
        />
      )}
      <button
        onClick={onOpen}
        className="h-11 flex-1 rounded-full border border-border bg-secondary/20 px-5 text-left text-sm text-muted-foreground hover:bg-secondary/40 transition-colors"
      >
        Start a post...
      </button>
      <div className="hidden sm:flex items-center gap-1 text-muted-foreground">
        <button onClick={onOpen} title="Add images" className="p-2 rounded-lg hover:bg-secondary/50 hover:text-foreground transition-colors">
          <ImageIcon className="w-4 h-4" />
        </button>
        <button onClick={onOpen} title="Create a poll" className="p-2 rounded-lg hover:bg-secondary/50 hover:text-foreground transition-colors">
          <BarChart3 className="w-4 h-4" />
        </button>
      </div>
      <button
        onClick={onOpen}
        aria-label="Create post"
        className="p-2.5 rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:opacity-90 transition-opacity"
      >
        <Plus className="w-4 h-4" />
      </button>
    </Card>
  );
};
