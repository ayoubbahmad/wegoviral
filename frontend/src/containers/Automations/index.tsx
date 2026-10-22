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
import { useT } from '@/i18n/provider';

export const AutomationsContainer = () => {
  const t = useT();
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
                    {t('creator.automations.name')}
                  </label>
                  <Input
                    placeholder={t('creator.automations.namePlaceholder')}
                    value={formData.name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>
                <div className='space-y-2'>
                  <label className='text-xs font-bold uppercase tracking-wider text-muted-foreground'>
                    {t('creator.automations.keyword')}
                  </label>
                  <Input
                    placeholder={t('creator.automations.keywordPlaceholder')}
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
                    {t('creator.automations.response')}
                  </label>
                  <Input
                    placeholder={t('creator.automations.responsePlaceholder')}
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
                        {t('creator.automations.commentReply')}
                      </p>
                      <p className='text-xs text-muted-foreground'>
                        {t('creator.automations.commentReplyBody')}
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
                      aria-label={t('creator.automations.commentReply')}
                      aria-pressed={formData.commentReplyEnabled}
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
                            {t('creator.automations.commentText')}
                          </label>

                          <Input
                            placeholder={t('creator.automations.commentTextPlaceholder')}
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
                      <p className='text-sm font-bold'>{t('creator.automations.targetPost')}</p>
                      <p className='text-xs text-muted-foreground'>
                        {t('creator.automations.targetPostBody')}
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
                        {t('creator.automations.global')}
                      </button>
                      <button
                        type='button'
                        onClick={() =>
                          setFormData({ ...formData, isGlobal: false })
                        }
                        className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${!formData.isGlobal ? 'bg-background shadow-sm text-primary' : 'text-muted-foreground'}`}
                      >
                        {t('creator.automations.specificPost')}
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
                    {editingId ? t('creator.automations.update') : t('creator.automations.save')}
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
            placeholder={t('creator.automations.search')}
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
                {t('creator.automations.all')}
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
                  <h3 className='text-xl font-bold'>{t('creator.automations.noResults')}</h3>
                  <p className='text-muted-foreground text-sm leading-relaxed'>
                    {t('creator.automations.noResultsBody')}
                  </p>
                  <Button
                    variant='outline'
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedPlatform('all');
                    }}
                  >
                    {t('creator.automations.clearFilters')}
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
                  <Table.Head>{t('creator.automations.columns.automation')}</Table.Head>
                  <Table.Head>{t('creator.automations.columns.platform')}</Table.Head>
                  <Table.Head>{t('creator.automations.columns.keyword')}</Table.Head>
                  <Table.Head>{t('creator.automations.columns.flow')}</Table.Head>
                  <Table.Head>{t('creator.automations.columns.runs')}</Table.Head>
                  <Table.Head align='right'>{t('creator.automations.columns.actions')}</Table.Head>
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
                                ? t('creator.automations.globalRule')
                                : t('creator.automations.postRule')}
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
                            {t('creator.automations.dm')}
                          </div>
                          {automation.commentReplyEnabled && (
                            <>
                              <ChevronRight className='w-3 h-3 rtl:rotate-180 text-muted-foreground/30' />
                              <div className='px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-500 text-[8px] font-black uppercase leading-none'>
                                {t('creator.automations.reply')}
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
                            aria-label={t('creator.automations.toggle')}
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
                            aria-label={t('creator.automations.edit')}
                            className='p-1.5 hover:bg-muted rounded-lg text-muted-foreground hover:text-primary transition-colors'
                          >
                            <Edit2 className='w-4 h-4' />
                          </button>
                          <button
                            onClick={() => handleDelete(automation.id)}
                            aria-label={t('creator.automations.delete')}
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
                <h4 className='font-bold'>{t('creator.automations.safety')}</h4>
              </div>
              <div className='space-y-4'>
                <div className='space-y-1'>
                  <p className='text-[11px] font-bold uppercase text-muted-foreground'>
                    {t('creator.automations.limits')}
                  </p>
                  <p className='text-xs leading-relaxed'>
                    {t('creator.automations.limitsBody', { limit: t('creator.automations.limitValue') })}
                  </p>
                </div>
                <div className='space-y-1'>
                  <p className='text-[11px] font-bold uppercase text-muted-foreground'>
                    {t('creator.automations.window')}
                  </p>
                  <p className='text-xs leading-relaxed'>
                    {t('creator.automations.windowBody')}
                  </p>
                </div>
                <div className='space-y-1'>
                  <p className='text-[11px] font-bold uppercase text-muted-foreground'>
                    {t('creator.automations.oneRule')}
                  </p>
                  <p className='text-xs leading-relaxed'>
                    {t('creator.automations.oneRuleBody')}
                  </p>
                </div>
                <div className='pt-2 border-t border-amber-500/10'>
                  <div className='flex items-start gap-2 text-xs text-amber-700/70 italic'>
                    <Info className='w-3 h-3 mt-0.5 shrink-0' />
                    <p>
                      {t('creator.automations.officialApi')}
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className='p-6 bg-primary/5 border-primary/20'>
              <h4 className='font-bold mb-4'>{t('creator.automations.binding')}</h4>
              <p className='text-xs text-muted-foreground leading-relaxed mb-4'>
                {t('creator.automations.bindingBody')}
              </p>
              <div className='p-3 bg-background rounded-2xl border border-border/50 text-center'>
                <p className='text-[10px] font-bold text-primary italic'>
                  {t('creator.automations.tip')}
                </p>
                <p className='text-[11px] mt-1'>
                  {t('creator.automations.tipBody')}
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};
