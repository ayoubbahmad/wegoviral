'use client';

import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap,
  Trash2,
  ChevronRight,
  ToggleLeft,
  ToggleRight,
  CheckCircle2,
  AlertTriangle,
  Info,
  Instagram,
  Edit2,
} from 'lucide-react';
import { useAutomationsController } from './controller';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Input } from '@/components/Input';
import { SearchInput } from '@/components/SearchInput';
import { ViewToggle } from '@/components/ViewToggle';
import { AutomationCard } from './components/AutomationCard';
import { Table } from '@/components/Table';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { mockedPosts } from './constants';

export const AutomationsContainer = () => {
  const {
    automations,
    isLoading,
    searchTerm,
    setSearchTerm,
    selectedPlatform,
    setSelectedPlatform,
    handleDelete,
    handleToggleActive,
    isAdding,
    editingId,
    viewType,
    setViewType,
    formData,
    setFormData,
    handleSubmit,
    startEdit,
  } = useAutomationsController();

  return (
    <>
      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className='overflow-hidden mb-8'
          >
            <Card className='p-6 border-primary/20 bg-primary/5 shadow-xl shadow-primary/5'>
              <form
                onSubmit={handleSubmit}
                className='grid grid-cols-1 md:grid-cols-3 gap-6'
              >
                <div className='space-y-2'>
                  <label className='text-xs font-bold uppercase tracking-wider text-muted-foreground'>
                    Automation Name
                  </label>
                  <Input
                    placeholder='e.g. Community Access'
                    value={formData.name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>
                <div className='space-y-2'>
                  <label className='text-xs font-bold uppercase tracking-wider text-muted-foreground'>
                    Keyword Trigger
                  </label>
                  <Input
                    placeholder='e.g. community'
                    value={formData.triggerKeyword}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setFormData({
                        ...formData,
                        triggerKeyword: e.target.value,
                      })
                    }
                    className='font-mono text-primary font-bold'
                  />
                </div>
                <div className='space-y-2'>
                  <label className='text-xs font-bold uppercase tracking-wider text-muted-foreground'>
                    Response Message
                  </label>
                  <Input
                    placeholder='Hey! Here is the link...'
                    value={formData.responseMessage}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setFormData({
                        ...formData,
                        responseMessage: e.target.value,
                      })
                    }
                  />
                </div>
                <div className='md:col-span-3 space-y-4 pt-2 border-t border-border/50'>
                  <div className='flex items-center justify-between'>
                    <div className='space-y-0.5'>
                      <p className='text-sm font-bold'>
                        Automated Comment Reply
                      </p>
                      <p className='text-xs text-muted-foreground'>
                        Automatically reply to the viewer&apos;s comment after
                        sending the DM.
                      </p>
                    </div>
                    <button
                      type='button'
                      onClick={() =>
                        setFormData({
                          ...formData,
                          commentReplyEnabled: !formData.commentReplyEnabled,
                        })
                      }
                      className='transition-colors'
                    >
                      {formData.commentReplyEnabled ? (
                        <ToggleRight className='w-8 h-8 text-primary' />
                      ) : (
                        <ToggleLeft className='w-8 h-8 text-muted-foreground/30' />
                      )}
                    </button>
                  </div>

                  <AnimatePresence>
                    {formData.commentReplyEnabled && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                      >
                        <div className='space-y-2'>
                          <label className='text-xs font-bold uppercase tracking-wider text-muted-foreground'>
                            Comment Text
                          </label>

                          <Input
                            placeholder='e.g. Just sent you a DM! Check it out.'
                            value={formData.commentReplyMessage}
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>,
                            ) =>
                              setFormData({
                                ...formData,
                                commentReplyMessage: e.target.value,
                              })
                            }
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Instagram Post Binding */}
                <div className='md:col-span-3 space-y-4 pt-2 border-t border-border/50'>
                  <div className='flex items-center justify-between'>
                    <div className='space-y-0.5'>
                      <p className='text-sm font-bold'>Target Specific Post</p>
                      <p className='text-xs text-muted-foreground'>
                        Link this automation to a specific Instagram post or
                        Reel.
                      </p>
                    </div>
                    <div className='flex bg-muted/50 p-1 rounded-xl'>
                      <button
                        type='button'
                        onClick={() =>
                          setFormData({
                            ...formData,
                            isGlobal: true,
                            instagramPostId: '',
                          })
                        }
                        className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${formData.isGlobal ? 'bg-background shadow-sm text-primary' : 'text-muted-foreground'}`}
                      >
                        Global
                      </button>
                      <button
                        type='button'
                        onClick={() =>
                          setFormData({ ...formData, isGlobal: false })
                        }
                        className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${!formData.isGlobal ? 'bg-background shadow-sm text-primary' : 'text-muted-foreground'}`}
                      >
                        Specific Post
                      </button>
                    </div>
                  </div>

                  <AnimatePresence>
                    {!formData.isGlobal && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className='overflow-hidden'
                      >
                        <div className='grid grid-cols-1 md:grid-cols-3 gap-3'>
                          {mockedPosts.map((post) => (
                            <div
                              key={post.id}
                              onClick={() =>
                                setFormData({
                                  ...formData,
                                  instagramPostId: post.id,
                                })
                              }
                              className={`flex items-center gap-3 p-3 rounded-2xl border cursor-pointer transition-all ${formData.instagramPostId === post.id ? 'bg-primary/10 border-primary shadow-sm' : 'bg-background border-border hover:border-primary/50'}`}
                            >
                              <Image
                                src={post.thumbnail}
                                alt={post.title}
                                width={40}
                                height={40}
                                className='rounded-lg object-cover'
                              />
                              <div className='min-w-0'>
                                <p className='text-xs font-bold truncate'>
                                  {post.title}
                                </p>
                                <p className='text-[10px] text-muted-foreground'>
                                  Instagram
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <div className='md:col-span-3 flex justify-end'>
                  <Button type='submit' variant='primary'>
                    <CheckCircle2 className='w-4 h-4' />
                    {editingId ? 'Update Automation' : 'Save Automation'}
                  </Button>
                </div>
              </form>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <div className='space-y-6'>
        {/* Controls Bar */}
        <div className='flex flex-col md:flex-row gap-4 items-center justify-between'>
          <SearchInput
            placeholder='Search automations...'
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSearchTerm(e.target.value)
            }
          />

          <div className='flex items-center gap-2'>
            <ViewToggle mode={viewType} onChange={setViewType} />

            <div className='flex bg-card p-1 border border-border/50 rounded-xl'>
              <button
                onClick={() => setSelectedPlatform('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${selectedPlatform === 'all' ? 'bg-primary/10 text-primary' : 'text-muted-foreground'}`}
              >
                All
              </button>
              <button
                onClick={() => setSelectedPlatform('instagram')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${selectedPlatform === 'instagram' ? 'bg-primary/10 text-primary' : 'text-muted-foreground'}`}
              >
                Instagram
              </button>
            </div>
          </div>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-4 gap-8'>
          <div className='lg:col-span-3'>
            {isLoading ? (
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className='h-48 rounded-3xl bg-muted animate-pulse border border-border/50'
                  />
                ))}
              </div>
            ) : automations.length === 0 ? (
              <Card className='p-20 text-center border-dashed bg-muted/20'>
                <div className='max-w-md mx-auto space-y-4'>
                  <div className='w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6'>
                    <Zap className='w-10 h-10 text-muted-foreground/30' />
                  </div>
                  <h3 className='text-xl font-bold'>No results found</h3>
                  <p className='text-muted-foreground text-sm leading-relaxed'>
                    Try adjusting your search or filters to find what
                    you&apos;re looking for.
                  </p>
                  <Button
                    variant='outline'
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedPlatform('all');
                    }}
                  >
                    Clear Filters
                  </Button>
                </div>
              </Card>
            ) : viewType === 'grid' ? (
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                {automations.map((automation) => (
                  <motion.div
                    key={automation.id}
                    layout
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                  >
                    <AutomationCard
                      automation={automation}
                      onEdit={startEdit}
                      onDelete={handleDelete}
                      onToggle={handleToggleActive}
                    />
                  </motion.div>
                ))}
              </div>
            ) : (
              <Table>
                <Table.Header>
                  <Table.Head>Automation</Table.Head>
                  <Table.Head>Platform</Table.Head>
                  <Table.Head>Keyword</Table.Head>
                  <Table.Head>Action Flow</Table.Head>
                  <Table.Head>Runs</Table.Head>
                  <Table.Head align='right'>Actions</Table.Head>
                </Table.Header>
                <Table.Body>
                  {automations.map((automation) => (
                    <Table.Row key={automation.id}>
                      <Table.Cell>
                        <div className='flex items-center gap-3'>
                          <div
                            className={cn(
                              'w-8 h-8 rounded-lg flex items-center justify-center',
                              automation.active
                                ? 'bg-primary/10 text-primary'
                                : 'bg-muted text-muted-foreground/30',
                            )}
                          >
                            <Zap className='w-4 h-4' />
                          </div>
                          <div>
                            <p className='text-sm font-bold leading-tight'>
                              {automation.name}
                            </p>
                            <p className='text-[9px] text-muted-foreground uppercase tracking-wider font-black opacity-60 mt-0.5'>
                              {automation.isGlobal
                                ? 'Global rule'
                                : 'Post-specific'}
                            </p>
                          </div>
                        </div>
                      </Table.Cell>
                      <Table.Cell>
                        <div className='flex items-center gap-2'>
                          <Instagram className='w-3.5 h-3.5 text-muted-foreground' />
                          <span className='text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none'>
                            Instagram
                          </span>
                        </div>
                      </Table.Cell>
                      <Table.Cell>
                        <code className='text-[10px] px-2 py-0.5 rounded-md bg-muted font-bold text-primary border border-border/50'>
                          &quot;{automation.triggerKeyword}&quot;
                        </code>
                      </Table.Cell>
                      <Table.Cell>
                        <div className='flex items-center gap-1.5'>
                          <div className='px-1.5 py-0.5 rounded bg-primary/20 text-primary text-[8px] font-black uppercase leading-none'>
                            DM
                          </div>
                          {automation.commentReplyEnabled && (
                            <>
                              <ChevronRight className='w-3 h-3 text-muted-foreground/30' />
                              <div className='px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-500 text-[8px] font-black uppercase leading-none'>
                                REPLY
                              </div>
                            </>
                          )}
                        </div>
                      </Table.Cell>
                      <Table.Cell>
                        <p className='text-sm font-black text-muted-foreground'>
                          {automation.runCount || 0}
                        </p>
                      </Table.Cell>
                      <Table.Cell align='right'>
                        <div className='flex items-center justify-end gap-1'>
                          <button
                            onClick={() =>
                              handleToggleActive(
                                automation.id,
                                automation.active,
                              )
                            }
                            className='p-1.5 hover:bg-muted rounded-lg transition-colors'
                          >
                            {automation.active ? (
                              <ToggleRight className='w-6 h-6 text-primary' />
                            ) : (
                              <ToggleLeft className='w-6 h-6 text-muted-foreground/30' />
                            )}
                          </button>
                          <button
                            onClick={() => startEdit(automation)}
                            className='p-1.5 hover:bg-muted rounded-lg text-muted-foreground hover:text-primary transition-colors'
                          >
                            <Edit2 className='w-4 h-4' />
                          </button>
                          <button
                            onClick={() => handleDelete(automation.id)}
                            className='p-1.5 hover:bg-muted rounded-lg text-muted-foreground hover:text-red-500 transition-colors'
                          >
                            <Trash2 className='w-4 h-4' />
                          </button>
                        </div>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            )}
          </div>

          {/* Safety Sidebar */}
          <div className='space-y-6'>
            <Card className='p-6 bg-amber-500/5 border-amber-500/20'>
              <div className='flex items-center gap-2 text-amber-500 mb-4'>
                <AlertTriangle className='w-5 h-5' />
                <h4 className='font-bold'>Instagram Safety</h4>
              </div>
              <div className='space-y-4'>
                <div className='space-y-1'>
                  <p className='text-[11px] font-bold uppercase text-muted-foreground'>
                    Monthly Limits
                  </p>
                  <p className='text-xs leading-relaxed'>
                    Safety limit:{' '}
                    <span className='font-bold text-foreground'>
                      200 automated messages/hour
                    </span>{' '}
                    to avoid account flags.
                  </p>
                </div>
                <div className='space-y-1'>
                  <p className='text-[11px] font-bold uppercase text-muted-foreground'>
                    7-Day Window
                  </p>
                  <p className='text-xs leading-relaxed'>
                    Automations only trigger for comments made within the last 7
                    days.
                  </p>
                </div>
                <div className='space-y-1'>
                  <p className='text-[11px] font-bold uppercase text-muted-foreground'>
                    One Rule Per Post
                  </p>
                  <p className='text-xs leading-relaxed'>
                    Only the first matched automation will trigger per
                    interaction.
                  </p>
                </div>
                <div className='pt-2 border-t border-amber-500/10'>
                  <div className='flex items-start gap-2 text-xs text-amber-700/70 italic'>
                    <Info className='w-3 h-3 mt-0.5 shrink-0' />
                    <p>
                      We use the official Instagram Business API to keep your
                      account safe.
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className='p-6 bg-primary/5 border-primary/20'>
              <h4 className='font-bold mb-4'>Post Binding</h4>
              <p className='text-xs text-muted-foreground leading-relaxed mb-4'>
                Link your automations to specific posts to run different
                campaigns on each Reel or post.
              </p>
              <div className='p-3 bg-background rounded-2xl border border-border/50 text-center'>
                <p className='text-[10px] font-bold text-primary italic'>
                  Pro Tip
                </p>
                <p className='text-[11px] mt-1'>
                  Global rules act as a backup for all other posts.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};
