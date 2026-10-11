'use client';

import { useState } from 'react';
import { Card } from '@/components/Card';
import { Textarea } from '@/components/Textarea';
import { Button } from '@/components/Button';
import { Select } from '@/components/Select';
import { CommunitySpace } from '@/types/communityFeed';

interface PostComposerProps {
  spaces: CommunitySpace[];
  activeSpace: CommunitySpace | null;
  onCreatePost: (content: string, spaceId: string) => void;
}

export const PostComposer = ({ spaces, activeSpace, onCreatePost }: PostComposerProps) => {
  const [content, setContent] = useState('');
  // null = follow the space currently filtered in the feed
  const [chosenSpaceId, setChosenSpaceId] = useState<string | null>(null);

  const postableSpaces = spaces.filter((space) => !space.adminOnly);
  const defaultSpaceId = activeSpace && !activeSpace.adminOnly ? activeSpace.id : '';
  const spaceId = chosenSpaceId ?? defaultSpaceId;
  const canPost = Boolean(content.trim() && spaceId);

  const handleSubmit = () => {
    if (!canPost) return;
    onCreatePost(content, spaceId);
    setContent('');
    setChosenSpaceId(null);
  };

  return (
    <Card>
      <Textarea
        placeholder="Share something with the community..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="mb-3"
      />
      <div className="flex items-center justify-between gap-3">
        <div className="w-56">
          <Select
            aria-label="Space to post in"
            value={spaceId}
            onChange={(e) => setChosenSpaceId(e.target.value)}
            className="h-9"
            options={[
              { value: '', label: 'Choose a space…' },
              ...postableSpaces.map((space) => ({
                value: space.id,
                label: `${space.emoji} ${space.name}`,
              })),
            ]}
          />
        </div>
        <Button variant="primary" onClick={handleSubmit} disabled={!canPost}>
          Post
        </Button>
      </div>
    </Card>
  );
};
