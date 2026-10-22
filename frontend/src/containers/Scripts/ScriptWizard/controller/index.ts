import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useGetHookTemplates, useGetStyleTemplates } from '../api';
import {
  useScriptTopicForm,
  useScriptRefinementForm,
  ScriptTopicValues,
  ScriptRefinementValues,
} from '../forms';
import { scriptsApi } from '../../Library/api';
import { Script } from '../../Library/api/types';
import { useT } from '@/i18n/provider';

// Types
export type Step = 'topic' | 'research' | 'angle' | 'hook' | 'style' | 'script';

/** Labels come from creator.wizard.steps.<id> */
export const STEPS = [
  { id: 'topic' },
  { id: 'research' },
  { id: 'angle' },
  { id: 'hook' },
  { id: 'style' },
  { id: 'script' },
] as const;

export const useScriptWizardController = (scriptId?: string) => {
  const t = useT();
  const router = useRouter();
  const { data: hookTemplates = [] } = useGetHookTemplates();
  const { data: styleTemplates = [] } = useGetStyleTemplates();

  const topicForm = useScriptTopicForm();
  const refinementForm = useScriptRefinementForm();

  const [activeStep, setActiveStep] = useState<Step>('topic');
  const [isProcessing, setIsProcessing] = useState(false);
  const [researchComplete, setResearchComplete] = useState(false);
  const [selectedHooks, setSelectedHooks] = useState<number[]>([]);
  const [selectedStyle, setSelectedStyle] = useState<number | null>(null);
  const [scriptGenerated, setScriptGenerated] = useState(false);
  const [editableContent, setEditableContent] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [selectedAngle, setSelectedAngle] = useState<string | null>(null);
  const [angles, setAngles] = useState<any[]>([]);

  // Fetch script data if editing
  const { data: scriptData, isLoading: isLoadingScript } = useQuery({
    queryKey: ['script', scriptId],
    queryFn: () => scriptsApi.getScript(scriptId!),
    enabled: !!scriptId,
  });

  // Fill the wizard once when the saved script arrives (during render, not in an effect)
  const [loadedScript, setLoadedScript] = useState<typeof scriptData>(undefined);
  if (scriptData && scriptData !== loadedScript) {
    setLoadedScript(scriptData);
    setSelectedHooks(scriptData.content?.hooks || []);
    setSelectedStyle(scriptData.content?.style || null);
    setEditableContent((scriptData.content as { generatedContent?: string })?.generatedContent || '');
    setResearchComplete(true);
    setScriptGenerated(true);
    setActiveStep('script');
  }
  useEffect(() => {
    if (scriptData) topicForm.reset({ topic: scriptData.content?.topic || '' });
  }, [scriptData, topicForm]);

  // Persistence mutations
  const saveMutation = useMutation({
    mutationFn: scriptsApi.createScript,
    onSuccess: () => {
      router.push('/creator/scripts');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      scriptsApi.updateScript(id, data),
    onSuccess: () => {
      router.push('/creator/scripts');
    },
  });

  // Scroll visibility tracking
  useEffect(() => {
    const handleScroll = () => {
      const sections = STEPS.map((step) =>
        document.getElementById(step.id),
      ).filter(Boolean);
      for (const section of sections) {
        if (section) {
          const rect = section.getBoundingClientRect();
          if (rect.top <= 200) {
            setActiveStep(section.id as Step);
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = useCallback((id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const navHeight = 140;
      const elementPosition =
        element.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - navHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
      setActiveStep(id as Step);
    }
  }, []);

  const handleTopicSubmit = useCallback(
    (values: ScriptTopicValues) => {
      setIsProcessing(true);
      setTimeout(() => {
        setIsProcessing(false);
        setResearchComplete(true);
        // MOCK: Generate angles after research
        setAngles(
          [
            {
              id: 'angle-1',
              title: t('creator.wizard.sampleAngles.scientific.title'),
              icon: 'Sparkles',
              description: t('creator.wizard.sampleAngles.scientific.description'),
              shockScore: 8.5,
            },
            {
              id: 'angle-2',
              title: t('creator.wizard.sampleAngles.personal.title'),
              icon: 'Users',
              description: t('creator.wizard.sampleAngles.personal.description'),
              shockScore: 7.2,
            },
            {
              id: 'angle-3',
              title: t('creator.wizard.sampleAngles.disruptor.title'),
              icon: 'Zap',
              description: t('creator.wizard.sampleAngles.disruptor.description'),
              shockScore: 9.8,
            },
          ].sort((a, b) => b.shockScore - a.shockScore),
        );
        scrollToSection('research');
      }, 2000);
    },
    [scrollToSection, t],
  );

  const toggleHookSelection = useCallback((id: number) => {
    setSelectedHooks((prev) =>
      prev.includes(id) ? prev.filter((h) => h !== id) : [...prev, id],
    );
  }, []);

  const handleGenerateScript = useCallback(() => {
    const defaultContent =
      "This is a revolutionary AI project from Google...\n\nIt's called Nano Banana Impact.\n\nAnd this thing is like Photoshop with superpowers.\n\nGoogle created this to completely transform how we edit and generate images.";
    setEditableContent(defaultContent);
    setScriptGenerated(true);
    scrollToSection('script');
  }, [scrollToSection]);

  const handleRefinementSubmit = useCallback(
    (values: ScriptRefinementValues) => {
      console.log('Refining script with:', values.refinement);
      // Simulate AI refinement by appending text for now
      setEditableContent(
        (prev) => prev + `\n\n${t('creator.wizard.refinementNote', { text: values.refinement })}`,
      );
      refinementForm.reset();
    },
    [refinementForm, t],
  );

  const handleSaveScript = async () => {
    const values = topicForm.getValues();
    const payload = {
      title: values.topic.substring(0, 50) + '...',
      content: {
        topic: values.topic,
        hooks: selectedHooks,
        style: selectedStyle,
        generatedContent: editableContent,
      },
      category: 'General',
    };

    try {
      if (scriptId) {
        await updateMutation.mutateAsync({ id: scriptId, data: payload });
      } else {
        await saveMutation.mutateAsync(payload);
      }
    } catch (err) {
      console.error('Failed to save script:', err);
      alert(t('creator.wizard.saveFailed'));
    }
  };

  return {
    activeStep,
    setActiveStep,
    isProcessing: isProcessing || isLoadingScript,
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
    isSaving: saveMutation.isPending || updateMutation.isPending,
    showHistory,
    setShowHistory,
    scrollToSection,
    hookTemplates,
    styleTemplates,
    topicForm,
    refinementForm,
    scriptData,
  };
};
