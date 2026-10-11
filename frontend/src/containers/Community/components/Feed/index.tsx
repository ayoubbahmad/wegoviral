import { MessageSquare } from 'lucide-react';
import { EmptyState } from '@/components/EmptyState';
import {
  CommunityEvent,
  CommunityPost,
  CommunitySpace,
  CommunityUser,
  NewPostInput,
} from '@/types/communityFeed';
import { StartPostCard } from './StartPostCard';
import { CreatePostModal } from './CreatePostModal';
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
  currentUser?: CommunityUser;
  isCreatePostOpen: boolean;
  setIsCreatePostOpen: (open: boolean) => void;
  handleCreatePost: (input: NewPostInput) => void;
  handleDeletePost: (postId: string) => void;
  handleCopyPostLink: (post: CommunityPost) => void;
  handleLikePost: (postId: string) => void;
  handleBookmarkPost: (postId: string) => void;
  handleVotePoll: (postId: string, optionId: string) => void;
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
  currentUser,
  isCreatePostOpen,
  setIsCreatePostOpen,
  handleCreatePost,
  handleDeletePost,
  handleCopyPostLink,
  handleLikePost,
  handleBookmarkPost,
  handleVotePoll,
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
          <StartPostCard
            currentUser={currentUser}
            onOpen={() => setIsCreatePostOpen(true)}
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
                isOwn={post.author.id === currentUser?.id}
                onLike={handleLikePost}
                onBookmark={handleBookmarkPost}
                onVote={handleVotePoll}
                onCopyLink={handleCopyPostLink}
                onDelete={handleDeletePost}
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

      <CreatePostModal
        isOpen={isCreatePostOpen}
        onClose={() => setIsCreatePostOpen(false)}
        spaces={spaces}
        activeSpace={activeSpace}
        onSubmit={handleCreatePost}
      />
    </div>
  );
};
