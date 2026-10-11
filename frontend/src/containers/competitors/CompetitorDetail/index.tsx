import { useState } from 'react';
import { useCompetitorDetailController } from './controller';
import {
  ArrowLeft,
  ExternalLink,
  Heart,
  MessageCircle,
  PlayCircle,
  TrendingUp,
  Zap,
  Plus,
  Check,
  Loader2,
  FolderPlus,
  Trash2,
  Users,
  Link as LinkIcon,
  Unlink,
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { CompetitorCalendar } from '@/containers/competitors/CompetitorCalendar';
import { BackNavigation } from '@/components/BackNavigation';

interface CompetitorDetailProps {
  id: string;
}

export const CompetitorDetail = ({ id }: CompetitorDetailProps) => {
  const {
    competitor,
    posts,
    isLoading,
    error,
    savedHooks,
    savedStructures,
    handleSave,
    allWatchlists,
    addToWatchlist,
    removeFromWatchlist,
    linkedCreator,
    allCreators,
    linkCreator,
    unlinkCreator,
    createAndLinkCreator,
  } = useCompetitorDetailController(id);

  const [isLinkingModalOpen, setIsLinkingModalOpen] = useState(false);
  const [newCreatorName, setNewCreatorName] = useState('');

  if (isLoading) {
    return (
      <div className='flex flex-col items-center justify-center min-h-[400px] gap-4'>
        <Loader2 className='w-8 h-8 animate-spin text-primary' />
        <p className='text-muted-foreground animate-pulse'>
          Analyzing competitor data...
        </p>
      </div>
    );
  }

  if (error || !competitor) {
    return (
      <div className='flex flex-col items-center justify-center min-h-[400px] gap-6 text-center'>
        <div className='p-4 bg-red-500/10 rounded-full'>
          <Zap className='w-12 h-12 text-red-500' />
        </div>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>
            Access Denied or Not Found
          </h2>
          <p className='text-muted-foreground mt-2 max-w-sm mx-auto'>
            {error instanceof Error
              ? error.message
              : error ||
                "This competitor doesn't exist or you don't have permission to view it."}
          </p>
        </div>
        <Link
          href='/creator/competitors'
          className='px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity'
        >
          Return to List
        </Link>
      </div>
    );
  }

  return (
    <div className='space-y-8 animate-in fade-in duration-500'>
      {/* Header */}
      <div className='flex flex-col gap-6 border-b border-border pb-8'>
        <BackNavigation href='/creator/competitors' label='Back to List' />

        <div className='flex flex-col md:flex-row md:items-start justify-between gap-6'>
          <div className='flex items-center gap-4'>
            <img
              src={competitor.avatarUrl}
              alt={competitor.name}
              className='w-20 h-20 rounded-full border-2 border-primary/10'
            />
            <div>
              <h1 className='text-3xl font-bold tracking-tight'>
                {competitor.name}
              </h1>
              <div className='flex items-center gap-2 text-muted-foreground mt-1'>
                <span className='capitalize'>{competitor.platform}</span>
                <span>•</span>
                <a
                  href={competitor.externalUrl}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='flex items-center gap-1 hover:text-primary hover:underline'
                >
                  @{competitor.handle} <ExternalLink className='w-3 h-3' />
                </a>
              </div>
              <div className='flex flex-wrap gap-2 mt-3'>
                {competitor.tags?.map((tag: any) => (
                  <span
                    key={tag}
                    className='text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground border border-border'
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Watchlists */}
              <div className='flex items-center gap-2 mt-4'>
                <span className='text-[10px] font-black uppercase tracking-widest text-muted-foreground mr-1'>
                  Watchlists:
                </span>
                <div className='flex flex-wrap gap-2'>
                  {competitor.watchlists?.map((wl: any) => (
                    <span
                      key={wl.id}
                      className='text-[10px] px-2 py-0.5 rounded-md bg-primary/10 text-primary font-bold border border-primary/20 flex items-center gap-1'
                    >
                      <FolderPlus className='w-3 h-3' />
                      {wl.name}
                      <button
                        onClick={() => removeFromWatchlist(wl.id)}
                        className='ml-1 hover:text-red-500 transition-colors'
                        title='Remove from watchlist'
                      >
                        <Trash2 className='w-2.5 h-2.5' />
                      </button>
                    </span>
                  ))}
                  <div className='relative group'>
                    <button className='text-[10px] px-2 py-0.5 rounded-md bg-secondary text-secondary-foreground border border-border hover:bg-secondary/80 flex items-center gap-1 font-bold transition-colors'>
                      <Plus className='w-3 h-3' /> Manage
                    </button>
                    <div className='absolute left-0 top-full mt-2 w-48 bg-card border border-border rounded-xl shadow-xl py-2 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all'>
                      <div className='px-3 py-1 border-b border-border/50 mb-1'>
                        <span className='text-[10px] font-bold text-muted-foreground uppercase tracking-widest'>
                          Select Watchlists
                        </span>
                      </div>
                      <div className='max-h-48 overflow-y-auto custom-scrollbar px-1'>
                        {allWatchlists.map((wl: any) => {
                          const isMember = competitor.watchlists?.some(
                            (w: any) => w.id === wl.id,
                          );
                          return (
                            <button
                              key={wl.id}
                              onClick={() =>
                                isMember
                                  ? removeFromWatchlist(wl.id)
                                  : addToWatchlist(wl.id)
                              }
                              className='w-full text-left px-3 py-2 rounded-lg text-xs font-medium hover:bg-secondary flex items-center justify-between transition-colors'
                            >
                              <span className='truncate'>{wl.name}</span>
                              {isMember && (
                                <Check className='w-3 h-3 text-primary' />
                              )}
                            </button>
                          );
                        })}
                      </div>
                      {allWatchlists.length === 0 && (
                        <div className='px-3 py-2 text-xs text-muted-foreground italic'>
                          No watchlists created.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Creator Linking */}
              <div className='flex items-center gap-2 mt-4 pt-4 border-t border-border/40'>
                <span className='text-[10px] font-black uppercase tracking-widest text-muted-foreground mr-1'>
                  Creator Brand:
                </span>
                {linkedCreator ? (
                  <div className='flex items-center gap-2'>
                    <span className='text-xs font-bold px-3 py-1 bg-indigo-500/10 text-indigo-600 rounded-full border border-indigo-500/20 flex items-center gap-1.5'>
                      <Users className='w-3 h-3' />
                      {linkedCreator.name}
                    </span>
                    <button
                      onClick={() => unlinkCreator()}
                      className='p-1 hover:bg-red-500/10 hover:text-red-500 rounded transition-colors'
                      title='Unlink from creator'
                    >
                      <Unlink className='w-3 h-3' />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsLinkingModalOpen(true)}
                    className='text-[10px] px-2 py-0.5 rounded-md bg-secondary text-secondary-foreground border border-border hover:bg-secondary/80 flex items-center gap-1 font-bold transition-colors'
                  >
                    <LinkIcon className='w-3 h-3' /> Link Creator
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className='flex gap-8 bg-card px-8 py-4 rounded-xl border border-border shadow-sm'>
            <div className='text-center'>
              <span className='block text-2xl font-bold'>
                {competitor.stats.followers}
              </span>
              <span className='text-xs text-muted-foreground uppercase tracking-wider font-medium'>
                Followers
              </span>
            </div>
            <div className='text-center border-l border-border pl-8'>
              <span className='block text-2xl font-bold'>
                {competitor.stats.avgLikes}
              </span>
              <span className='text-xs text-muted-foreground uppercase tracking-wider font-medium'>
                Avg Likes
              </span>
            </div>
            <div className='text-center border-l border-border pl-8'>
              <span className='block text-2xl font-bold text-green-500'>
                {competitor.stats.engagementRate}
              </span>
              <span className='text-xs text-muted-foreground uppercase tracking-wider font-medium'>
                Eng. Rate
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className='grid lg:grid-cols-3 gap-8'>
        {/* Main Content: Calendar + Posts */}
        <div className='lg:col-span-2 space-y-8'>
          {/* Content Analysis */}
          <div>
            <div className='flex items-center gap-2 mb-6'>
              <div className='p-1.5 bg-purple-500/10 rounded-lg'>
                <Zap className='w-5 h-5 text-purple-600 dark:text-purple-400' />
              </div>
              <h2 className='text-xl font-bold'>Viral Hits & Analysis</h2>
            </div>

            {posts.length > 0 ? (
              <div className='grid gap-6'>
                {posts.map((post: any) => (
                  <div
                    key={post.id}
                    className='flex flex-col lg:flex-row gap-6 p-5 rounded-2xl bg-card border border-border shadow-sm hover:shadow-md transition-shadow'
                  >
                    {/* Thumbnail / Visual */}
                    <div className='relative w-full lg:w-48 aspect-[4/5] bg-secondary rounded-xl overflow-hidden shrink-0 group'>
                      <img
                        src={post.thumbnailUrl}
                        alt='Post thumbnail'
                        className='w-full h-full object-cover transition-transform group-hover:scale-105'
                      />
                      {post.isViral && (
                        <div className='absolute top-2 right-2 px-2 py-1 bg-red-500 text-white text-[10px] font-bold uppercase rounded shadow-sm flex items-center gap-1'>
                          <TrendingUp className='w-3 h-3' /> Viral
                        </div>
                      )}
                      <div className='absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity'>
                        <PlayCircle className='w-10 h-10 text-white drop-shadow-lg' />
                      </div>
                    </div>

                    {/* Content Data */}
                    <div className='flex-1 space-y-4'>
                      <div className='flex justify-between items-start'>
                        <p className='font-medium text-lg leading-snug line-clamp-2 pr-4'>
                          {post.captionExcerpt}
                        </p>
                        <span className='text-xs text-muted-foreground whitespace-nowrap'>
                          {new Date(post.postedAt).toLocaleDateString()}
                        </span>
                      </div>

                      <div className='flex items-center gap-4 text-sm text-muted-foreground'>
                        <span className='flex items-center gap-1'>
                          <Heart className='w-4 h-4' />{' '}
                          {post.metrics.likes.toLocaleString()}
                        </span>
                        <span className='flex items-center gap-1'>
                          <MessageCircle className='w-4 h-4' />{' '}
                          {post.metrics.comments.toLocaleString()}
                        </span>
                      </div>

                      {/* Analysis Card */}
                      {post.analysis && (
                        <div className='mt-4 p-4 rounded-xl bg-secondary/30 border border-border/50 space-y-3'>
                          <div className='grid md:grid-cols-2 gap-4'>
                            <div>
                              <span className='text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1'>
                                Hook Strategy
                              </span>
                              <div className='flex items-center gap-2'>
                                <p className='text-sm font-medium text-foreground bg-background px-3 py-2 rounded-lg border border-border flex-1 flex items-center gap-2'>
                                  <span className='w-1.5 h-1.5 rounded-full bg-blue-500' />
                                  {post.analysis.hook}
                                </p>
                                <button
                                  onClick={() => handleSave(post.id, 'hook')}
                                  disabled={savedHooks.includes(post.id)}
                                  className={cn(
                                    'p-2 rounded-lg border transition-all',
                                    savedHooks.includes(post.id)
                                      ? 'bg-green-500/10 border-green-500/20 text-green-600'
                                      : 'bg-background border-border hover:bg-secondary text-muted-foreground hover:text-foreground',
                                  )}
                                  title='Save Hook to Library'
                                >
                                  {savedHooks.includes(post.id) ? (
                                    <Check className='w-4 h-4' />
                                  ) : (
                                    <Plus className='w-4 h-4' />
                                  )}
                                </button>
                              </div>
                            </div>
                            <div>
                              <span className='text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1'>
                                Structure
                              </span>
                              <div className='flex items-center gap-2'>
                                <p className='text-sm font-medium text-foreground bg-background px-3 py-2 rounded-lg border border-border flex-1 flex items-center gap-2'>
                                  <span className='w-1.5 h-1.5 rounded-full bg-orange-500' />
                                  {post.analysis.structure}
                                </p>
                                <button
                                  onClick={() =>
                                    handleSave(post.id, 'structure')
                                  }
                                  disabled={savedStructures.includes(post.id)}
                                  className={cn(
                                    'p-2 rounded-lg border transition-all',
                                    savedStructures.includes(post.id)
                                      ? 'bg-green-500/10 border-green-500/20 text-green-600'
                                      : 'bg-background border-border hover:bg-secondary text-muted-foreground hover:text-foreground',
                                  )}
                                  title='Save Structure to Library'
                                >
                                  {savedStructures.includes(post.id) ? (
                                    <Check className='w-4 h-4' />
                                  ) : (
                                    <Plus className='w-4 h-4' />
                                  )}
                                </button>
                              </div>
                            </div>
                          </div>
                          <div className='pt-2'>
                            <span className='text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1'>
                              Why it worked
                            </span>
                            <p className='text-sm text-muted-foreground italic'>
                              "{post.analysis.notes}"
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className='text-center py-12 rounded-xl border border-dashed border-border bg-secondary/10'>
                <p className='text-muted-foreground'>
                  No posts tracked for this competitor yet.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Area: Calendar */}
        <div className='space-y-6'>
          <CompetitorCalendar posts={posts} />

          {/* Quick Actions (Future) */}
          <div className='p-6 rounded-xl bg-gradient-to-br from-indigo-500/5 to-purple-500/5 border border-indigo-500/10'>
            <h3 className='font-semibold text-sm mb-2'>💡 Analysis Tips</h3>
            <ul className='text-xs text-muted-foreground space-y-2 list-disc pl-4'>
              <li>Look for patterns in successful hooks.</li>
              <li>Check if they post more frequently on weekends.</li>
              <li>Note the editing pace of viral clips.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Linking Modal */}
      {isLinkingModalOpen && (
        <div className='fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200'>
          <div className='bg-card border border-border rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-6 animate-in zoom-in-95 duration-200'>
            <div className='flex items-center justify-between'>
              <h3 className='text-lg font-bold'>Link to Creator Brand</h3>
              <button
                onClick={() => setIsLinkingModalOpen(false)}
                className='p-1 hover:bg-secondary rounded-lg transition-colors'
              >
                <Plus className='w-5 h-5 rotate-45' />
              </button>
            </div>

            <p className='text-sm text-muted-foreground'>
              Group multiple platform profiles (YouTube, TikTok, Instagram)
              under one Brand name.
            </p>

            <div className='space-y-4'>
              {/* Existing Creators */}
              {allCreators.length > 0 && (
                <div className='space-y-2'>
                  <span className='text-[10px] font-bold text-muted-foreground uppercase tracking-widest'>
                    Select Existing
                  </span>
                  <div className='grid gap-2 max-h-40 overflow-y-auto custom-scrollbar pr-1'>
                    {allCreators.map((creator: any) => (
                      <button
                        key={creator.id}
                        onClick={() => {
                          linkCreator(creator.id);
                          setIsLinkingModalOpen(false);
                        }}
                        className='flex items-center justify-between w-full px-4 py-3 bg-secondary/50 hover:bg-secondary rounded-xl text-left transition-colors group'
                      >
                        <span className='font-medium'>{creator.name}</span>
                        <LinkIcon className='w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity' />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className='relative'>
                <div className='absolute inset-0 flex items-center'>
                  <span className='w-full border-t border-border' />
                </div>
                <div className='relative flex justify-center text-xs uppercase'>
                  <span className='bg-card px-2 text-muted-foreground'>or</span>
                </div>
              </div>

              {/* Create New */}
              <div className='space-y-2'>
                <span className='text-[10px] font-bold text-muted-foreground uppercase tracking-widest'>
                  Create New Brand
                </span>
                <div className='flex gap-2'>
                  <input
                    type='text'
                    placeholder='Brand Name (e.g., MrBeast)'
                    value={newCreatorName}
                    onChange={(e) => setNewCreatorName(e.target.value)}
                    className='flex-1 bg-secondary border border-border rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all'
                  />
                  <button
                    disabled={!newCreatorName.trim()}
                    onClick={() => {
                      createAndLinkCreator(newCreatorName);
                      setNewCreatorName('');
                      setIsLinkingModalOpen(false);
                    }}
                    className='px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-bold hover:opacity-90 disabled:opacity-50 transition-all'
                  >
                    Create
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
