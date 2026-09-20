import { CommunityPost } from '@/types/communityFeed';
import { PostComposer } from './PostComposer';
import { PostCard } from './PostCard';

interface FeedTabProps {
  posts: CommunityPost[];
  handleCreatePost: (content: string) => void;
  handleLikePost: (postId: string) => void;
}

export const FeedTab = ({ posts, handleCreatePost, handleLikePost }: FeedTabProps) => {
  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <PostComposer onCreatePost={handleCreatePost} />
      {posts.map((post) => (
        <PostCard key={post.id} post={post} onLike={handleLikePost} />
      ))}
    </div>
  );
};
