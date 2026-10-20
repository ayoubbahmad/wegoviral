import { Flame } from 'lucide-react';
import { Card } from '@/components/Card';
import { CommunitySpace, TopPost } from '@/types/communityFeed';
import { useT } from '@/i18n/provider';

interface TopPostsCardProps {
  posts: TopPost[];
  spacesById: Record<string, CommunitySpace>;
  onSelect: (post: TopPost) => void;
}

export const TopPostsCard = ({ posts, spacesById, onSelect }: TopPostsCardProps) => {
  const t = useT();
  return (
    <Card padding="sm" className="p-5">
      <h3 className="mb-4 flex items-center gap-2 font-bold text-sm">
        <Flame className="w-4 h-4 text-primary" />
        {t('feed.topPosts.title')}
      </h3>

      {posts.length === 0 && (
        <p className="text-sm text-muted-foreground">{t('feed.topPosts.empty')}</p>
      )}

      <ol className="space-y-4">
        {posts.map((post, index) => {
          const space = spacesById[post.spaceId];
          return (
            <li key={post.id}>
              <button
                onClick={() => onSelect(post)}
                className="group flex w-full items-start gap-3 text-start"
              >
                <span className="w-4 shrink-0 pt-0.5 text-sm font-black tabular-nums text-muted-foreground/60">
                  {index + 1}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-medium leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                    {post.title || post.content}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground truncate">
                    @{post.author.username}
                    {space && ` · ${space.emoji} ${space.name}`}
                  </p>
                </div>
              </button>
            </li>
          );
        })}
      </ol>
    </Card>
  );
};
