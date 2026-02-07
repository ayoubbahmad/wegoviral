import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useGetHookTemplates, useGetStyleTemplates } from '../api';
import { useScriptTopicForm, useScriptRefinementForm, ScriptTopicValues, ScriptRefinementValues } from '../forms';
import { scriptsApi } from '../../Library/api';
import { Script } from '../../Library/api/types';

// Types
export type Step = 'topic' | 'research' | 'hook' | 'style' | 'script';

export const STEPS = [
  { id: 'topic', label: 'Topic' },
  { id: 'research', label: 'Research' },
  { id: 'hook', label: 'Hook' },
  { id: 'style', label: 'Style' },
  { id: 'script', label: 'Script' },
] as const;

export const useScriptWizardController = (scriptId?: string) => {
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
  const [showHistory, setShowHistory] = useState(false);

  // Fetch script data if editing
  const { data: scriptData, isLoading: isLoadingScript } = useQuery({
    queryKey: ['script', scriptId],
    queryFn: () => scriptsApi.getScript(scriptId!),
    enabled: !!scriptId,
  });

  // Initialize state from script data
  useEffect(() => {
    if (scriptData) {
      topicForm.reset({ topic: scriptData.content?.topic || '' });
      setSelectedHooks(scriptData.content?.hooks || []);
      setSelectedStyle(scriptData.content?.style || null);
      setResearchComplete(true);
      setScriptGenerated(true);
      setActiveStep('script');
    }
  }, [scriptData, topicForm]);

  // Persistence mutations
  const saveMutation = useMutation({
    mutationFn: scriptsApi.createScript,
    onSuccess: () => {
      router.push('/scripts');
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string, data: any }) => scriptsApi.updateScript(id, data),
    onSuccess: () => {
      router.push('/scripts');
    }
  });

  // Scroll visibility tracking
  useEffect(() => {
    const handleScroll = () => {
      const sections = STEPS.map((step) => document.getElementById(step.id)).filter(Boolean);
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
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - navHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
      setActiveStep(id as Step);
    }
  }, []);

  const handleTopicSubmit = useCallback((values: ScriptTopicValues) => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setResearchComplete(true);
      scrollToSection('research');
    }, 2000);
  }, [scrollToSection]);

  const toggleHookSelection = useCallback((id: number) => {
    setSelectedHooks((prev) => 
      prev.includes(id) ? prev.filter((h) => h !== id) : [...prev, id]
    );
  }, []);

  const handleGenerateScript = useCallback(() => {
    setScriptGenerated(true);
    scrollToSection('script');
  }, [scrollToSection]);

  const handleRefinementSubmit = useCallback((values: ScriptRefinementValues) => {
    console.log("Refining script with:", values.refinement);
    refinementForm.reset();
  }, [refinementForm]);

  const handleSaveScript = async () => {
    const values = topicForm.getValues();
    const payload = {
      title: values.topic.substring(0, 50) + "...",
      content: {
        topic: values.topic,
        hooks: selectedHooks,
        style: selectedStyle,
        generatedContent: scriptData?.content?.generatedContent || "This is a revolutionary AI project from Google..." 
      },
      category: "General"
    };

    try {
      if (scriptId) {
        await updateMutation.mutateAsync({ id: scriptId, data: payload });
      } else {
        await saveMutation.mutateAsync(payload);
      }
    } catch (err) {
      console.error("Failed to save script:", err);
      alert("Failed to save script. Please try again.");
    }
  };

  return {
    activeStep,
    setActiveStep,
    isProcessing: isProcessing || isLoadingScript,
    researchComplete,
    selectedHooks,
    toggleHookSelection,
    selectedStyle,
    setSelectedStyle,
    scriptGenerated,
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
    scriptData
  };
};
