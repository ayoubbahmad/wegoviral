'use client';

import { useState } from 'react';
import { Plus, Link, Tags, Loader2, User } from 'lucide-react';
import { Modal } from '@/components/Modal';
import { libraryApi } from '../api';
import { Badge } from '@/components/Badge';
import Image from 'next/image';

import { useLibraryStore } from '../slice';
import { Hook, ScriptTemplate } from '../api/types';

interface LibraryAssetModalProps {
  onAddHook?: (hook: any) => Promise<{ success: boolean; error?: string }>;
  onUpdateHook?: (
    id: string,
    hook: any,
  ) => Promise<{ success: boolean; error?: string }>;
  onAddScript?: (script: any) => Promise<{ success: boolean; error?: string }>;
  onUpdateScript?: (
    id: string,
    script: any,
  ) => Promise<{ success: boolean; error?: string }>;
  editItem?: Hook | ScriptTemplate | null;
}

export function LibraryAssetModal({
  onAddHook,
  onUpdateHook,
  onAddScript,
  onUpdateScript,
  editItem,
}: LibraryAssetModalProps) {
  const { isAdding, setIsAdding, isEditing, setIsEditing } = useLibraryStore();
  const isOpen = isAdding || isEditing;

  const [type, setType] = useState<'hook' | 'script'>('hook');

  // Form states
  const [hookContent, setHookContent] = useState('');
  const [hookType, setHookType] = useState('Verbal');
  const [hookEmotion, setHookEmotion] = useState('Curiosity');
  const [sourceUrl, setSourceUrl] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [metadata, setMetadata] = useState<any>(null);
  const [isFetchingMetadata, setIsFetchingMetadata] = useState(false);

  const [scriptTitle, setScriptTitle] = useState('');
  const [scriptCategory, setScriptCategory] = useState('Educational');
  const [scriptSteps, setScriptSteps] = useState([
    { step: 'Hook', description: '' },
  ]);

  const handleAddStep = () => {
    setScriptSteps([...scriptSteps, { step: 'New Step', description: '' }]);
  };

  const handleFetchMetadata = async () => {
    if (!sourceUrl || !sourceUrl.startsWith('http')) return;

    setIsFetchingMetadata(true);
    try {
      const data = await libraryApi.getMetadata(sourceUrl);
      setMetadata(data);
    } catch (error) {
      console.error('Failed to fetch metadata', error);
    } finally {
      setIsFetchingMetadata(false);
    }
  };

  // Populate form for editing
  useState(() => {
    if (isEditing && editItem) {
      if ('content' in editItem && typeof editItem.content === 'string') {
        const hook = editItem as Hook;
        setType('hook');
        setHookContent(hook.content);
        setHookType(hook.type);
        setHookEmotion(hook.emotion);
        setSourceUrl(hook.sourceUrl || '');
        setTags(hook.tags || []);
        setMetadata(hook.sourceMetadata || null);
      } else {
        const script = editItem as ScriptTemplate;
        setType('script');
        setScriptTitle(script.title);
        setScriptCategory(script.category);
        setScriptSteps(script.content || [{ step: 'Hook', description: '' }]);
        setSourceUrl(script.sourceUrl || '');
        setTags(script.tags || []);
        setMetadata(script.sourceMetadata || null);
      }
    }
  });

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    let result;
    if (type === 'hook') {
      const hookData = {
        content: hookContent,
        type: hookType,
        emotion: hookEmotion,
        topic: metadata?.title || 'General',
        sourceUrl: sourceUrl,
        tags: tags,
        sourceMetadata: metadata,
      };

      if (isEditing && editItem) {
        result = await onUpdateHook?.(editItem.id, hookData);
      } else {
        result = await onAddHook?.(hookData);
      }
    } else {
      const scriptData = {
        title: scriptTitle,
        category: scriptCategory,
        content: scriptSteps,
        tags: tags,
        sourceUrl: sourceUrl,
        sourceMetadata: metadata,
      };

      if (isEditing && editItem) {
        result = await onUpdateScript?.(editItem.id, scriptData);
      } else {
        result = await onAddScript?.(scriptData);
      }
    }

    if (result?.success) {
      setIsAdding(false);
      setIsEditing(false);

      // Reset states
      setHookContent('');
      setScriptTitle('');
      setScriptSteps([{ step: 'Hook', description: '' }]);
      setSourceUrl('');
      setTags([]);
      setMetadata(null);
    } else {
      alert(result?.error || 'Failed to save item');
    }
    setIsLoading(false);
  };

  const handleClose = () => {
    setIsAdding(false);
    setIsEditing(false);
  };

  return (
    <>
      <button
        onClick={() => setIsAdding(true)}
        className='flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity'
      >
        <Plus className='w-4 h-4' />
        <span>Add New</span>
      </button>

      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        title={
          isEditing
            ? `Edit ${type === 'hook' ? 'Hook' : 'Script'}`
            : type === 'hook'
              ? 'Add New Hook'
              : 'Add Script Template'
        }
      >
        <div className='space-y-4 max-h-[70vh] overflow-y-auto px-1'>
          <div className='flex bg-secondary p-1 rounded-lg mb-6 sticky top-0 z-10'>
            <button
              onClick={() => setType('hook')}
              className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${type === 'hook' ? 'bg-background shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Hook
            </button>
            <button
              onClick={() => setType('script')}
              className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${type === 'script' ? 'bg-background shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Script
            </button>
          </div>

          <form className='space-y-4' onSubmit={handleSave}>
            {type === 'hook' ? (
              <>
                <div>
                  <label className='block text-sm font-medium mb-1.5'>
                    Content
                  </label>
                  <textarea
                    value={hookContent}
                    onChange={(e) => setHookContent(e.target.value)}
                    className='w-full min-h-[100px] p-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring'
                    placeholder='Write your hook here...'
                    required
                  />
                </div>
                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <label className='block text-sm font-medium mb-1.5'>
                      Type
                    </label>
                    <select
                      value={hookType}
                      onChange={(e) => setHookType(e.target.value)}
                      className='w-full p-2.5 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring'
                    >
                      <option>Verbal</option>
                      <option>Visual</option>
                      <option>Text</option>
                      <option>Audio</option>
                    </select>
                  </div>
                  <div>
                    <label className='block text-sm font-medium mb-1.5'>
                      Emotion
                    </label>
                    <select
                      value={hookEmotion}
                      onChange={(e) => setHookEmotion(e.target.value)}
                      className='w-full p-2.5 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring'
                    >
                      <option>Curiosity</option>
                      <option>Fear</option>
                      <option>Humor</option>
                      <option>Desire</option>
                      <option>Surprise</option>
                      <option>Inspiration</option>
                    </select>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className='block text-sm font-medium mb-1.5'>
                    Script Title
                  </label>
                  <input
                    type='text'
                    value={scriptTitle}
                    onChange={(e) => setScriptTitle(e.target.value)}
                    className='w-full p-2.5 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring'
                    placeholder='e.g. 1-Minute Educational Reel'
                    required
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium mb-1.5'>
                    Category
                  </label>
                  <select
                    value={scriptCategory}
                    onChange={(e) => setScriptCategory(e.target.value)}
                    className='w-full p-2.5 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring'
                  >
                    <option>Educational</option>
                    <option>Entertainment</option>
                    <option>Sales</option>
                    <option>Storytelling</option>
                  </select>
                </div>
                <div className='space-y-3'>
                  <div className='flex items-center justify-between'>
                    <label className='block text-sm font-medium'>
                      Structure Steps
                    </label>
                    <button
                      type='button'
                      onClick={handleAddStep}
                      className='text-xs text-primary font-medium hover:underline'
                    >
                      + Add Step
                    </button>
                  </div>
                  {scriptSteps.map((step, index) => (
                    <div key={index} className='flex gap-3 items-start'>
                      <input
                        type='text'
                        value={step.step}
                        onChange={(e) => {
                          const newSteps = [...scriptSteps];
                          newSteps[index].step = e.target.value;
                          setScriptSteps(newSteps);
                        }}
                        className='w-1/3 p-2 text-sm rounded-lg border border-input bg-background'
                        placeholder='Step name'
                      />
                      <input
                        type='text'
                        value={step.description}
                        onChange={(e) => {
                          const newSteps = [...scriptSteps];
                          newSteps[index].description = e.target.value;
                          setScriptSteps(newSteps);
                        }}
                        className='flex-1 p-2 text-sm rounded-lg border border-input bg-background'
                        placeholder='What happens in this step...'
                      />
                    </div>
                  ))}
                </div>
              </>
            )}

            <div className='space-y-4 pt-2 border-t border-border mt-4'>
              <div className='flex flex-col gap-1.5'>
                <label className='text-sm font-medium'>Source URL</label>
                <div className='flex gap-2'>
                  <div className='relative flex-1'>
                    <Link className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground' />
                    <input
                      type='url'
                      value={sourceUrl}
                      onChange={(e) => setSourceUrl(e.target.value)}
                      onBlur={handleFetchMetadata}
                      className='w-full pl-9 pr-3 py-2.5 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring text-sm'
                      placeholder='Paste TikTok, IG, or YT link...'
                    />
                  </div>
                  <button
                    type='button'
                    onClick={handleFetchMetadata}
                    disabled={isFetchingMetadata || !sourceUrl}
                    className='px-4 py-2 bg-secondary text-secondary-foreground rounded-lg text-sm font-medium hover:bg-secondary/80 disabled:opacity-50'
                  >
                    {isFetchingMetadata ? (
                      <Loader2 className='w-4 h-4 animate-spin' />
                    ) : (
                      'Fetch'
                    )}
                  </button>
                </div>
              </div>

              {metadata && (
                <div className='p-4 rounded-xl bg-muted/30 border border-border flex gap-4 animate-in fade-in slide-in-from-top-2 duration-300'>
                  {metadata.thumbnail && (
                    <div className='relative w-20 h-28 shrink-0 rounded-lg overflow-hidden bg-muted border border-border'>
                      <Image
                        src={metadata.thumbnail}
                        alt='Preview'
                        fill
                        className='object-cover'
                      />
                    </div>
                  )}
                  <div className='flex flex-col gap-2 py-1 overflow-hidden'>
                    {metadata.handle && (
                      <div className='flex items-center gap-1.5 text-primary'>
                        <User className='w-3 h-3' />
                        <span className='text-[10px] font-black uppercase tracking-widest'>
                          {metadata.handle}
                        </span>
                      </div>
                    )}
                    <h5 className='text-sm font-bold line-clamp-2 leading-snug'>
                      {metadata.title || 'Untitled Video'}
                    </h5>
                    {metadata.description && (
                      <p className='text-[10px] text-muted-foreground line-clamp-2 leading-relaxed italic'>
                        {metadata.description}
                      </p>
                    )}
                  </div>
                </div>
              )}

              <div className='flex flex-col gap-1.5'>
                <label className='text-sm font-medium'>Tags</label>
                <div className='relative'>
                  <Tags className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground' />
                  <input
                    type='text'
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleAddTag}
                    className='w-full pl-9 pr-3 py-2.5 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring text-sm'
                    placeholder='Type and press Enter...'
                  />
                </div>
                {tags.length > 0 && (
                  <div className='flex flex-wrap gap-2 mt-2'>
                    {tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant='secondary'
                        className='pl-2 pr-1 h-6 gap-1'
                      >
                        {tag}
                        <button
                          type='button'
                          onClick={() => removeTag(tag)}
                          className='hover:text-destructive p-0.5 rounded-full transition-colors'
                        >
                          <Plus className='w-3 h-3 rotate-45' />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className='pt-4 sticky bottom-0 bg-background pb-2'>
              <button
                type='submit'
                disabled={isLoading}
                className='w-full py-2.5 bg-primary text-primary-foreground font-medium rounded-lg hover:opacity-90 disabled:opacity-50 transition-all shadow-lg shadow-primary/20'
              >
                {isLoading ? (
                  <div className='flex items-center justify-center gap-2'>
                    <Loader2 className='w-4 h-4 animate-spin' />
                    <span>Saving...</span>
                  </div>
                ) : type === 'hook' ? (
                  'Save Hook'
                ) : (
                  'Save Script Template'
                )}
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
}
