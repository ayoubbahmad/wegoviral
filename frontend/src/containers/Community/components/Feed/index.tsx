import { MessageSquare } from 'lucide-react';
import { EmptyState } from '@/components/EmptyState';
import { CommunityPost, CommunitySpace } from '@/types/communityFeed';
import { PostComposer } from './PostComposer';
import { PostCard } from './PostCard';
import { SpaceChips } from './SpaceChips';

interface FeedTabProps {
  posts: CommunityPost[];
  spaces: CommunitySpace[];
  activeSpace: CommunitySpace | null;
  activeSpaceId: string;
  postCountBySpace: Record<string, number>;
  setActiveSpaceId: (spaceId: string) => void;
  handleCreatePost: (content: string, spaceId: string) => void;
  handleLikePost: (postId: string) => void;
}

export const FeedTab = ({
  posts,
  spaces,
  activeSpace,
  activeSpaceId,
  postCountBySpace,
  setActiveSpaceId,
  handleCreatePost,
  handleLikePost,
}: FeedTabProps) => {
  const spacesById = Object.fromEntries(spaces.map((space) => [space.id, space]));

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <SpaceChips
        spaces={spaces}
        activeSpaceId={activeSpaceId}
        postCountBySpace={postCountBySpace}
        onChange={setActiveSpaceId}
      />
      {activeSpace && (
        <p className="px-1 text-sm text-muted-foreground">{activeSpace.description}</p>
      )}

      {!activeSpace?.adminOnly && (
        <PostComposer
          spaces={spaces}
          activeSpace={activeSpace}
          onCreatePost={handleCreatePost}
        />
      )}

      {posts.length === 0 ? (
        <EmptyState
          icon={MessageSquare}
          title="No posts here yet"
          description="Be the first to start the conversation in this space."
        />
      ) : (
        posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            space={spacesById[post.spaceId]}
            onLike={handleLikePost}
            onSpaceClick={setActiveSpaceId}
          />
        ))
      )}
    </div>
  );
};
