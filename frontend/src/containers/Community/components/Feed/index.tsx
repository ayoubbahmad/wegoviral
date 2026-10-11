import { MessageSquare } from 'lucide-react';
import { EmptyState } from '@/components/EmptyState';
import {
  CommunityEvent,
  CommunityPost,
  CommunitySpace,
} from '@/types/communityFeed';
import { PostComposer } from './PostComposer';
import { PostCard } from './PostCard';
import { SpaceChips } from './SpaceChips';
import { UpcomingEventsCard } from './UpcomingEventsCard';
import { TopPostsCard } from './TopPostsCard';
import { ALL_SPACES_ID } from '../../slice';

interface FeedTabProps {
  posts: CommunityPost[];
  topPosts: CommunityPost[];
  upcomingEvents: CommunityEvent[];
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
  topPosts,
  upcomingEvents,
  spaces,
  activeSpace,
  activeSpaceId,
  postCountBySpace,
  setActiveSpaceId,
  handleCreatePost,
  handleLikePost,
}: FeedTabProps) => {
  const spacesById = Object.fromEntries(
    spaces.map((space) => [space.id, space]),
  );

  // Show the post in the full feed, then bring it into view
  const handleSelectTopPost = (post: CommunityPost) => {
    setActiveSpaceId(ALL_SPACES_ID);
    requestAnimationFrame(() => {
      document
        .getElementById(`post-${post.id}`)
        ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px] xl:grid-cols-[minmax(0,1fr)_340px] items-start">
      <div className="min-w-0 space-y-4">
        <SpaceChips
          spaces={spaces}
          activeSpaceId={activeSpaceId}
          postCountBySpace={postCountBySpace}
          onChange={setActiveSpaceId}
        />
        {activeSpace && (
          <p className="px-1 text-sm text-muted-foreground">
            {activeSpace.description}
          </p>
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
            <div key={post.id} id={`post-${post.id}`} className="scroll-mt-8">
              <PostCard
                post={post}
                space={spacesById[post.spaceId]}
                onLike={handleLikePost}
                onSpaceClick={setActiveSpaceId}
              />
            </div>
          ))
        )}
      </div>

      <aside className="hidden lg:block sticky top-8 space-y-6">
        <UpcomingEventsCard events={upcomingEvents} />
        <TopPostsCard
          posts={topPosts}
          spacesById={spacesById}
          onSelect={handleSelectTopPost}
        />
      </aside>
    </div>
  );
};
