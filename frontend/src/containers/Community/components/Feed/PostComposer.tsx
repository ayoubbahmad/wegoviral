'use client';

import { useState } from 'react';
import { Card } from '@/components/Card';
import { Textarea } from '@/components/Textarea';
import { Button } from '@/components/Button';

interface PostComposerProps {
  onCreatePost: (content: string) => void;
}

export const PostComposer = ({ onCreatePost }: PostComposerProps) => {
  const [content, setContent] = useState('');

  const handleSubmit = () => {
    if (!content.trim()) return;
    onCreatePost(content);
    setContent('');
  };

  return (
    <Card>
      <Textarea
        placeholder="Share something with the community..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="mb-3"
      />
      <div className="flex justify-end">
        <Button variant="primary" onClick={handleSubmit} disabled={!content.trim()}>
          Post
        </Button>
      </div>
    </Card>
  );
};
