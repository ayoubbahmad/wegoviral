'use client';

import { useState } from 'react';
import { Modal } from '@/components/Modal';
import { Input } from '@/components/Input';
import { Textarea } from '@/components/Textarea';
import { Button } from '@/components/Button';
import { Label } from '@/components/Label';

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { title: string; date: string; description?: string }) => void;
}

export const CreateEventModal = ({ isOpen, onClose, onSubmit }: CreateEventModalProps) => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = () => {
    if (!title.trim() || !date) return;
    onSubmit({ title, date, description: description.trim() || undefined });
    setTitle('');
    setDate('');
    setDescription('');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Event">
      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label>Title</Label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Live Hook Workshop"
          />
        </div>
        <div className="space-y-1.5">
          <Label>Date</Label>
          <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label>Description (optional)</Label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What's this event about?"
          />
        </div>
        <div className="flex justify-end">
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={!title.trim() || !date}
          >
            Create
          </Button>
        </div>
      </div>
    </Modal>
  );
};
