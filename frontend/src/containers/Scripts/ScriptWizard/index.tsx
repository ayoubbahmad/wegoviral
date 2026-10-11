'use client';

import {
  Lightbulb,
  BookOpen,
  Anchor,
  Palette,
  FileText,
  ChevronDown,
  ExternalLink,
  RefreshCw,
  X,
  Copy,
  Zap,
  Plus,
  Sparkles,
  Check,
  Clock,
  Download,
  Share2,
  ArrowRight,
  Users,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useScriptWizardController, Step } from './controller';
import { Button } from '@/components/Button';
import { Label } from '@/components/Label';

const STEPS_WITH_ICONS = [
  { id: 'topic', label: 'Topic', icon: Lightbulb },
  { id: 'research', label: 'Research', icon: BookOpen },
  { id: 'angle', label: 'Angle', icon: Sparkles },
  { id: 'hook', label: 'Hook', icon: Anchor },
  { id: 'style', label: 'Style', icon: Palette },
  { id: 'script', label: 'Script', icon: FileText },
] as const;

export function ScriptWizardContainer({ scriptId }: { scriptId?: string }) {
  const {
    activeStep,
    isProcessing,
    researchComplete,
    angles,
    selectedAngle,
    setSelectedAngle,
    selectedHooks,
    toggleHookSelection,
    selectedStyle,
    setSelectedStyle,
    scriptGenerated,
    editableContent,
    setEditableContent,
    handleTopicSubmit,
    handleGenerateScript,
    handleRefinementSubmit,
    handleSaveScript,
    isSaving,
    showHistory,
    setShowHistory,
    scrollToSection,
    hookTemplates,
    styleTemplates,
    topicForm,
    refinementForm,
    scriptData,
  } = useScriptWizardController(scriptId);

  return (
    <div className='space-y-12 pb-32'>
      <div className='flex items-end justify-between'>
        <div className='space-y-1'>
          <h1 className='text-3xl font-bold tracking-tight'>Scripts</h1>
          <p className='text-muted-foreground'>
            Create high-performing video scripts with AI.
          </p>
        </div>
        <Link
          href='/creator/scripts/ingredients'
          className='flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary/50 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-all mb-1'
        >
          <Sparkles className='w-3.5 h-3.5' /> View 7 Core Variables
        </Link>
      </div>

      {/* Sticky Jump Navigation */}
      <div className='sticky top-8 z-30 flex justify-center'>
        <div className='flex items-center gap-2 p-2 rounded-2xl bg-card/80 backdrop-blur-md border border-border/50 shadow-2xl'>
          {STEPS_WITH_ICONS.map((step) => (
            <button
              key={step.id}
              onClick={() => scrollToSection(step.id)}
              className={cn(
                'flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all active:scale-95 whitespace-nowrap',
                activeStep === step.id
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50',
              )}
            >
              <step.icon className='w-4 h-4' />
              {step.label}
            </button>
          ))}
        </div>
      </div>

      {/* Step 1: Topic */}
      <section
        id='topic'
        className='p-8 rounded-2xl border border-border bg-card/30 relative group'
      >
        <div className='flex items-center justify-between mb-8'>
          <div className='flex items-center gap-3'>
            <div className='p-2.5 rounded-xl bg-blue-500/10 text-blue-500'>
              <Lightbulb className='w-5 h-5' />
            </div>
            <h2 className='text-xl font-black uppercase tracking-tight'>
              Describe your topic
            </h2>
          </div>
          <div className='flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity'>
            <button className='p-2 rounded-lg hover:bg-secondary text-muted-foreground transition-colors'>
              <RefreshCw className='w-4 h-4' />
            </button>
            <button className='p-2 rounded-lg hover:bg-secondary text-muted-foreground transition-colors'>
              <Plus className='w-4 h-4' />
            </button>
            <button className='p-2 rounded-lg hover:bg-secondary text-muted-foreground transition-colors'>
              <X className='w-4 h-4' />
            </button>
          </div>
        </div>

        <form
          onSubmit={topicForm.handleSubmit(handleTopicSubmit)}
          className='space-y-6'
        >
          <div className='space-y-2'>
            <div className='flex items-center justify-between px-2 mb-2'>
              <Label className='text-[10px] font-black uppercase tracking-widest text-muted-foreground/60'>
                Script Prompt
              </Label>
              <span
                className={cn(
                  'text-[10px] font-bold',
                  (topicForm.watch('topic')?.length || 0) > 400
                    ? 'text-destructive'
                    : 'text-muted-foreground/40',
                )}
              >
                {topicForm.watch('topic')?.length || 0}/500
              </span>
            </div>
            <textarea
              {...topicForm.register('topic')}
              placeholder="What do you want to make a video about? e.g. 'Build a SaaS in 30 days...'"
              className='w-full min-h-[160px] bg-secondary/20 border border-border/50 rounded-2xl p-6 text-xl leading-relaxed font-medium outline-none focus:border-primary/50 transition-colors resize-none placeholder:text-muted-foreground/20'
            />
            {topicForm.formState.errors.topic && (
              <p className='text-xs text-destructive ml-2 font-bold'>
                {topicForm.formState.errors.topic.message}
              </p>
            )}

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-4'>
              <div className='p-4 rounded-xl bg-blue-500/5 border border-blue-500/10 space-y-2'>
                <h4 className='text-[10px] font-black uppercase tracking-widest text-blue-500'>
                  The Subject
                </h4>
                <p className='text-xs text-muted-foreground leading-relaxed'>
                  Describe the core focus. e.g. "Self-driving cars".
                </p>
              </div>
              <div className='p-4 rounded-xl bg-purple-500/5 border border-purple-500/10 space-y-2'>
                <h4 className='text-[10px] font-black uppercase tracking-widest text-purple-500'>
                  The Angle
                </h4>
                <p className='text-xs text-muted-foreground leading-relaxed'>
                  How should we tell the story? e.g. "Focus on urban happiness".
                </p>
              </div>
            </div>
          </div>

          <div className='flex items-center justify-between pt-4'>
            <div className='flex items-center gap-6'>
              <Link
                href='/creator/scripts/ingredients'
                className='flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors'
              >
                How to write the best prompt{' '}
                <ExternalLink className='w-3.5 h-3.5' />
              </Link>
            </div>

            <div className='flex items-center gap-6'>
              <span className='text-xs font-black uppercase tracking-widest text-muted-foreground/60'>
                Next step: 360° Research
              </span>
              <button
                type='submit'
                className='flex items-center gap-2 px-8 py-3.5 rounded-xl bg-primary text-primary-foreground font-black uppercase tracking-widest text-xs hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95'
              >
                Start Researching <ArrowRight className='w-4 h-4' />
              </button>
            </div>
          </div>
        </form>
      </section>

      {/* Step 2: Research */}
      <section
        id='research'
        className='p-8 rounded-2xl border border-border bg-card/30'
      >
        <div className='flex items-center gap-3 mb-8'>
          <div className='p-2.5 rounded-xl bg-purple-500/10 text-purple-500'>
            <BookOpen className='w-5 h-5' />
          </div>
          <h2 className='text-xl font-black uppercase tracking-tight'>
            Review the research
          </h2>
        </div>

        {isProcessing ? (
          <div className='flex flex-col items-center justify-center py-20 gap-4'>
            <div className='w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin' />
            <p className='font-bold text-muted-foreground animate-pulse'>
              Deep-diving into your topic...
            </p>
          </div>
        ) : researchComplete ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className='space-y-8'
          >
            {/* 360 Degree View Header */}
            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
              <div className='md:col-span-2 p-6 rounded-2xl bg-secondary/20 border border-border/50 space-y-4'>
                <h3 className='text-sm font-black uppercase tracking-widest text-foreground flex items-center gap-2'>
                  <Sparkles className='w-4 h-4 text-primary' /> Executive
                  Summary
                </h3>
                <p className='text-sm text-muted-foreground leading-[1.8]'>
                  This topic is currently peaking in interest among creators.
                  The key to success here lies in addressing the "overwhelm"
                  factor. Most viewers are looking for simplified, actionable
                  frameworks rather than theoretical deep-dives.
                </p>
              </div>
              <div className='p-6 rounded-2xl bg-primary/5 border border-primary/10 flex flex-col justify-center text-center space-y-2'>
                <span className='text-[10px] font-black uppercase tracking-widest text-primary/60'>
                  Topic Potential
                </span>
                <div className='text-4xl font-black text-primary'>8.8/10</div>
                <span className='text-[10px] font-bold text-muted-foreground'>
                  High Virality Factor
                </span>
              </div>
            </div>

            {/* Key Facts & Shock Scores */}
            <div className='space-y-4'>
              <h3 className='text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2'>
                Market Data & Key Facts
              </h3>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                {[
                  {
                    fact: 'AI tool adoption grew by 300% in the creative sector last year.',
                    score: 9.2,
                  },
                  {
                    fact: '70% of viewers drop off within the first 15 seconds if technical jargon is used.',
                    score: 8.5,
                  },
                  {
                    fact: 'Custom workflows are searched 5x more than general tool reviews.',
                    score: 7.8,
                  },
                  {
                    fact: "The 'Creator-to-Entrepreneur' pipeline is the fastest growing audience segment.",
                    score: 8.1,
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className='flex items-center justify-between p-4 rounded-xl bg-card border border-border/50 group hover:border-primary/30 transition-all'
                  >
                    <p className='text-sm font-medium text-foreground/80 pr-4'>
                      {item.fact}
                    </p>
                    <div className='flex flex-col items-end shrink-0'>
                      <span className='text-[8px] font-black uppercase tracking-widest text-muted-foreground mb-1'>
                        Shock
                      </span>
                      <div className='px-2 py-1 rounded bg-secondary text-[10px] font-black text-primary border border-primary/20'>
                        {item.score}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ELI5 & Misconceptions */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
              <div className='space-y-4'>
                <h3 className='text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2'>
                  How it works (ELI5)
                </h3>
                <div className='p-6 rounded-2xl bg-orange-500/5 border border-orange-500/10'>
                  <p className='text-sm text-orange-900/80 dark:text-orange-200/60 leading-relaxed italic'>
                    "Imagine explaining a complex engine to a 5-year old by
                    calling it a 'super fast toy box'—that's how we're going to
                    frame this technical topic to keep it accessible."
                  </p>
                </div>
              </div>
              <div className='space-y-4'>
                <h3 className='text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2'>
                  Common Misconceptions
                </h3>
                <div className='space-y-2'>
                  {[
                    {
                      myth: 'It takes months to master.',
                      reality: 'Core concepts in 2 hours.',
                    },
                    {
                      myth: 'You need a high budget.',
                      reality: 'Start with free tools.',
                    },
                  ].map((m, i) => (
                    <div
                      key={i}
                      className='p-3 rounded-xl border border-destructive/10 bg-destructive/5 flex gap-3 text-xs'
                    >
                      <span className='font-black text-destructive shrink-0'>
                        VS
                      </span>
                      <p className='text-muted-foreground'>
                        <strong>{m.myth}</strong> → {m.reality}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className='flex justify-end pt-4'>
              <button
                onClick={() => scrollToSection('angle')}
                className='flex items-center gap-2 px-8 py-3.5 rounded-xl bg-primary text-primary-foreground font-black uppercase tracking-widest text-xs hover:bg-primary/90 transition-all shadow-lg shadow-primary/20'
              >
                Explore Angles <ArrowRight className='w-4 h-4' />
              </button>
            </div>
          </motion.div>
        ) : (
          <div className='flex flex-col items-center justify-center py-16 gap-4 text-center'>
            <div className='p-4 rounded-full bg-secondary/30'>
              <Clock className='w-8 h-8 text-muted-foreground/30' />
            </div>
            <p className='text-sm font-medium text-muted-foreground max-w-sm'>
              Describe your topic first, and our AI will generate a detailed
              research report for your script.
            </p>
          </div>
        )}
      </section>

      {/* Step 3: Angle */}
      <section
        id='angle'
        className='p-8 rounded-2xl border border-border bg-card/30'
      >
        <div className='flex items-center justify-between mb-8'>
          <div className='flex items-center gap-3'>
            <div className='p-2.5 rounded-xl bg-blue-500/10 text-blue-500'>
              <Sparkles className='w-5 h-5' />
            </div>
            <h2 className='text-xl font-black uppercase tracking-tight'>
              Select your angle
            </h2>
          </div>
          <p className='text-[10px] font-black uppercase tracking-widest text-muted-foreground/60'>
            Choose the narrative direction
          </p>
        </div>

        {!researchComplete ? (
          <div className='py-16 flex flex-col items-center justify-center text-center gap-4'>
            <div className='p-4 rounded-full bg-secondary/30'>
              <Sparkles className='w-8 h-8 text-muted-foreground/30' />
            </div>
            <p className='text-sm font-medium text-muted-foreground max-w-sm'>
              Complete research to see recommended script angles.
            </p>
          </div>
        ) : (
          <div className='space-y-8'>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
              {angles.map((angle: any) => (
                <button
                  key={angle.id}
                  onClick={() => setSelectedAngle(angle.id)}
                  className={cn(
                    'flex flex-col text-left p-6 rounded-2xl border-2 transition-all group relative overflow-hidden',
                    selectedAngle === angle.id
                      ? 'border-primary bg-primary/5 shadow-xl shadow-primary/10'
                      : 'border-border/50 hover:border-primary/20 bg-card hover:bg-secondary/10',
                  )}
                >
                  <div className='flex items-start justify-between mb-4'>
                    <div
                      className={cn(
                        'p-2.5 rounded-xl transition-colors',
                        selectedAngle === angle.id
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-secondary text-muted-foreground group-hover:text-foreground',
                      )}
                    >
                      {angle.icon === 'Zap' && <Zap className='w-5 h-5' />}
                      {angle.icon === 'Sparkles' && (
                        <Sparkles className='w-5 h-5' />
                      )}
                      {angle.icon === 'Users' && <Users className='w-5 h-5' />}
                    </div>
                    <div className='flex flex-col items-end'>
                      <span className='text-[8px] font-black uppercase tracking-widest text-muted-foreground mb-1'>
                        Impact
                      </span>
                      <div className='text-xs font-black text-primary'>
                        {angle.shockScore}
                      </div>
                    </div>
                  </div>

                  <h3 className='font-black text-sm uppercase tracking-tight mb-2 pr-8'>
                    {angle.title}
                  </h3>
                  <p className='text-xs text-muted-foreground leading-relaxed line-clamp-2'>
                    {angle.description}
                  </p>

                  {selectedAngle === angle.id && (
                    <div className='absolute top-6 right-6 p-1 rounded-full bg-primary text-primary-foreground'>
                      <Check className='w-3 h-3' />
                    </div>
                  )}
                </button>
              ))}
            </div>

            <div className='flex justify-end pt-4'>
              <button
                disabled={!selectedAngle}
                onClick={() => scrollToSection('hook')}
                className='flex items-center gap-2 px-8 py-3.5 rounded-xl bg-primary text-primary-foreground font-black uppercase tracking-widest text-xs hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 disabled:opacity-50'
              >
                Pick Hooks <ArrowRight className='w-4 h-4' />
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Step 4: Hook */}
      <section
        id='hook'
        className='p-8 rounded-2xl border border-border bg-card/30'
      >
        <div className='flex items-center justify-between mb-8'>
          <div className='flex items-center gap-3'>
            <div className='p-2.5 rounded-xl bg-pink-500/10 text-pink-500'>
              <Anchor className='w-5 h-5' />
            </div>
            <h2 className='text-xl font-black uppercase tracking-tight'>
              Pick your hook
            </h2>
          </div>
          <div className='flex items-center gap-4'>
            <div className='relative'>
              <select className='appearance-none bg-secondary/30 border border-border/50 rounded-xl px-4 py-2 pr-10 text-xs font-bold text-muted-foreground outline-none focus:border-primary/50 transition-colors'>
                <option>Filter by tag</option>
              </select>
              <ChevronDown className='absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none' />
            </div>
            <input
              type='text'
              placeholder='Search templates...'
              className='bg-secondary/30 border border-border/50 rounded-xl px-4 py-2 text-xs font-bold text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-primary/50 transition-colors'
            />
          </div>
        </div>

        <div className='grid grid-cols-5 gap-4 mb-8'>
          {hookTemplates.map((hook: any) => (
            <button
              key={hook.id}
              onClick={() => toggleHookSelection(hook.id)}
              className={cn(
                'group relative aspect-[9/16] rounded-2xl overflow-hidden border-2 transition-all active:scale-95',
                selectedHooks.includes(hook.id)
                  ? 'border-primary shadow-lg shadow-primary/20'
                  : 'border-border/50 hover:border-border',
              )}
            >
              <img
                src={hook.thumbnailUrl}
                className='w-full h-full object-cover'
                alt={hook.title}
              />
              <div className='absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/80 via-black/40 to-transparent'>
                <p className='text-[10px] font-black uppercase tracking-tight text-white leading-tight mb-1'>
                  {hook.title}
                </p>
                <div className='flex items-center gap-1.5'>
                  <Zap className='w-3 h-3 text-pink-500 fill-pink-500' />
                  <span className='text-[10px] font-black text-white/50'>
                    {hook.views}
                  </span>
                </div>
              </div>
              {selectedHooks.includes(hook.id) && (
                <div className='absolute top-2 right-2 p-1 rounded-full bg-primary text-primary-foreground'>
                  <Check className='w-3 h-3' />
                </div>
              )}
            </button>
          ))}
        </div>

        <div className='flex items-center justify-between'>
          <p className='text-xs font-bold text-muted-foreground'>
            {selectedHooks.length} hooks selected
          </p>
          <button
            onClick={() => scrollToSection('style')}
            className='flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-black uppercase tracking-widest text-xs hover:bg-primary/90 transition-all shadow-lg shadow-primary/20'
          >
            Next: Style <ArrowRight className='w-4 h-4' />
          </button>
        </div>
      </section>

      {/* Step 5: Style */}
      <section
        id='style'
        className='p-8 rounded-2xl border border-border bg-card/30'
      >
        <div className='flex items-center gap-3 mb-8'>
          <div className='p-2.5 rounded-xl bg-orange-500/10 text-orange-500'>
            <Palette className='w-5 h-5' />
          </div>
          <h2 className='text-xl font-black uppercase tracking-tight'>
            Choose a style
          </h2>
        </div>

        <div className='grid grid-cols-3 gap-6 mb-8'>
          {styleTemplates.map((style: any) => (
            <button
              key={style.id}
              onClick={() => setSelectedStyle(style.id)}
              className={cn(
                'group relative aspect-video rounded-2xl overflow-hidden border-2 transition-all active:scale-95',
                selectedStyle === style.id
                  ? 'border-primary shadow-lg shadow-primary/20'
                  : 'border-border/50 hover:border-border',
              )}
            >
              <img
                src={style.thumbnailUrl}
                className='w-full h-full object-cover'
                alt={style.title}
              />
              <div className='absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors' />
              <div className='absolute inset-0 flex flex-col items-center justify-center p-4'>
                <p className='text-sm font-black uppercase tracking-widest text-white text-center'>
                  {style.title}
                </p>
                <span className='text-[10px] font-black text-white/60 mt-2 uppercase tracking-widest'>
                  {style.views} Views
                </span>
              </div>
              {selectedStyle === style.id && (
                <div className='absolute top-4 right-4 p-1.5 rounded-full bg-primary text-primary-foreground'>
                  <Check className='w-4 h-4' />
                </div>
              )}
            </button>
          ))}
        </div>

        <div className='flex justify-end'>
          <button
            onClick={handleGenerateScript}
            className='flex items-center gap-2 px-8 py-4 rounded-2xl bg-primary text-primary-foreground font-black uppercase tracking-widest text-sm hover:bg-primary/90 transition-all shadow-xl shadow-primary/30 hover:scale-105 active:scale-95'
          >
            Generate First Draft <Sparkles className='w-4 h-4' />
          </button>
        </div>
      </section>

      {/* Step 6: Script */}
      <section
        id='script'
        className='p-8 rounded-2xl border border-border bg-card/30 relative'
      >
        <div className='flex items-center justify-between mb-8'>
          <div className='flex items-center gap-3'>
            <div className='p-2.5 rounded-xl bg-green-500/10 text-green-500'>
              <FileText className='w-5 h-5' />
            </div>
            <h2 className='text-xl font-black uppercase tracking-tight'>
              Your Script
            </h2>
          </div>
          <div className='flex items-center gap-2'>
            <button
              onClick={() => setShowHistory(true)}
              className='flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary/50 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground transition-all'
            >
              <Clock className='w-4 h-4' /> History
            </button>
            <div className='w-px h-6 bg-border mx-2' />
            <Button
              variant='primary'
              size='sm'
              className='rounded-xl h-10 px-4'
              onClick={handleSaveScript}
              disabled={isSaving}
            >
              {isSaving ? (
                <div className='w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin' />
              ) : (
                <Check className='w-4 h-4' />
              )}
              Save to Library
            </Button>
            <div className='w-px h-6 bg-border mx-2' />
            <button className='p-2.5 rounded-xl bg-secondary/50 text-muted-foreground hover:text-foreground transition-all'>
              <Copy className='w-4 h-4' />
            </button>
            <button className='p-2.5 rounded-xl bg-secondary/50 text-muted-foreground hover:text-foreground transition-all'>
              <Download className='w-4 h-4' />
            </button>
            <button className='p-2.5 rounded-xl bg-secondary/50 text-muted-foreground hover:text-foreground transition-all'>
              <Share2 className='w-4 h-4' />
            </button>
          </div>
        </div>

        {scriptGenerated ? (
          <div className='space-y-8'>
            <div className='relative p-8 rounded-2xl bg-secondary/30 border border-border/50 min-h-[400px]'>
              <div className='absolute top-8 right-8 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 z-10'>
                {(() => {
                  const words = editableContent.trim()
                    ? editableContent.trim().split(/\s+/).length
                    : 0;
                  const wpm = 160;
                  const totalSeconds = Math.floor((words / wpm) * 60);
                  const mins = Math.floor(totalSeconds / 60);
                  const secs = totalSeconds % 60;

                  return `${words} Words · ~${mins}m ${secs}s`;
                })()}
              </div>
              <div className='relative z-0'>
                <textarea
                  value={editableContent}
                  onChange={(e) => setEditableContent(e.target.value)}
                  className='w-full min-h-[400px] bg-transparent border-none text-lg leading-[2] text-foreground font-medium outline-none resize-none focus:ring-0 placeholder:text-muted-foreground/30'
                  placeholder='Your AI script will appear here. Feel free to add your own touch...'
                />
              </div>
            </div>

            <form
              onSubmit={refinementForm.handleSubmit(handleRefinementSubmit)}
              className='space-y-4'
            >
              <h3 className='text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2'>
                Quick Refinements
              </h3>
              <div className='flex flex-col gap-2'>
                <div className='flex items-center gap-2'>
                  <input
                    type='text'
                    {...refinementForm.register('refinement')}
                    placeholder="e.g. 'Make it more professional' or 'Add a CTA at the end'"
                    className='flex-1 bg-secondary/20 border border-border/50 rounded-2xl px-6 py-4 text-sm font-medium outline-none focus:border-primary/50 transition-all shadow-sm'
                  />
                  <button
                    type='submit'
                    className='p-4 rounded-2xl bg-blue-600 text-white hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/20 active:scale-95'
                  >
                    <ArrowRight className='w-5 h-5' />
                  </button>
                </div>
                {refinementForm.formState.errors.refinement && (
                  <p className='text-[10px] text-destructive ml-2 font-bold'>
                    {refinementForm.formState.errors.refinement.message}
                  </p>
                )}
              </div>
              <div className='flex items-center gap-2 overflow-x-auto hide-scrollbar pb-2'>
                {[
                  'Professional',
                  'Humorous',
                  'Shorten',
                  'Extend',
                  'Rewrite Hooks',
                ].map((action) => (
                  <button
                    key={action}
                    type='button'
                    onClick={() =>
                      refinementForm.setValue('refinement', action)
                    }
                    className='px-4 py-2 rounded-full border border-border/50 bg-card hover:border-primary/50 hover:bg-secondary transition-all text-[10px] font-black uppercase tracking-widest text-muted-foreground whitespace-nowrap'
                  >
                    {action}
                  </button>
                ))}
              </div>
            </form>

            <div className='flex items-center gap-4 p-6 rounded-2xl bg-yellow-500/5 border border-yellow-500/10'>
              <div className='p-2 rounded-lg bg-yellow-500/20 text-yellow-500'>
                <Zap className='w-4 h-4' />
              </div>
              <p className='text-xs font-bold text-yellow-500/80 leading-relaxed'>
                You can always head back to earlier steps to tweak your
                research, angle selection or style.
              </p>
            </div>
          </div>
        ) : (
          <div className='py-32 flex flex-col items-center justify-center text-center gap-6'>
            <div className='p-6 rounded-2xl bg-secondary/20 border border-border/50'>
              <Sparkles className='w-12 h-12 text-primary/30' />
            </div>
            <div className='space-y-2'>
              <p className='font-bold text-foreground'>
                Ready for the first draft?
              </p>
              <p className='text-sm text-muted-foreground max-w-xs mx-auto'>
                Complete the previous steps to unlock high-quality AI script
                generation.
              </p>
            </div>
            <button
              onClick={handleGenerateScript}
              className='px-8 py-3 rounded-xl bg-secondary/50 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground transition-all'
            >
              Skip to Draft
            </button>
          </div>
        )}
      </section>

      {/* History Sidebar/Modal Placeholder */}
      <AnimatePresence>
        {showHistory && (
          <div className='fixed inset-0 z-[100] flex items-center justify-center p-6'>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowHistory(false)}
              className='absolute inset-0 bg-background/80 backdrop-blur-xl'
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className='relative w-full max-w-2xl bg-card border border-border rounded-2xl shadow-2xl overflow-hidden'
            >
              <div className='p-8 border-b border-border flex items-center justify-between'>
                <h3 className='text-xl font-black uppercase tracking-tight'>
                  Script History
                </h3>
                <button
                  onClick={() => setShowHistory(false)}
                  className='p-2 rounded-xl hover:bg-secondary text-muted-foreground transition-colors'
                >
                  <X className='w-5 h-5' />
                </button>
              </div>
              <div className='p-8 space-y-4 max-h-[60vh] overflow-y-auto'>
                {[1, 2, 3].map((v) => (
                  <button
                    key={v}
                    className='w-full p-6 rounded-2xl border border-border/50 bg-secondary/10 hover:border-primary/30 hover:bg-secondary/20 transition-all text-left group'
                  >
                    <div className='flex items-center justify-between mb-2'>
                      <span className='text-[10px] font-black uppercase tracking-widest text-muted-foreground'>
                        Version {4 - v}
                      </span>
                      <span className='text-[10px] font-bold text-muted-foreground/40 group-hover:text-primary transition-colors'>
                        Apply this version
                      </span>
                    </div>
                    <p className='text-sm font-medium text-foreground/70 truncate'>
                      This is a revolutionary AI project from Google...
                    </p>
                    <div className='flex items-center gap-4 mt-4 text-[10px] font-bold text-muted-foreground'>
                      <span>{v} hour ago</span>
                      <span>241 Words</span>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
