import { useState, useEffect, useCallback } from 'react';
import { useGetHookTemplates, useGetStyleTemplates } from '../api';

// Types
export type Step = 'topic' | 'research' | 'hook' | 'style' | 'script';

export const STEPS = [
  { id: 'topic', label: 'Topic' },
  { id: 'research', label: 'Research' },
  { id: 'hook', label: 'Hook' },
  { id: 'style', label: 'Style' },
  { id: 'script', label: 'Script' },
] as const;

export const useScriptWizardController = () => {
  const { data: hookTemplates = [] } = useGetHookTemplates();
  const { data: styleTemplates = [] } = useGetStyleTemplates();
  
  const [activeStep, setActiveStep] = useState<Step>('topic');
  const [topic, setTopic] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [researchComplete, setResearchComplete] = useState(false);
  const [selectedHooks, setSelectedHooks] = useState<number[]>([]);
  const [selectedStyle, setSelectedStyle] = useState<number | null>(null);
  const [scriptGenerated, setScriptGenerated] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

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

  const handleProcessResearch = useCallback(() => {
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

  return {
    activeStep,
    setActiveStep,
    topic,
    setTopic,
    isProcessing,
    researchComplete,
    selectedHooks,
    toggleHookSelection,
    selectedStyle,
    setSelectedStyle,
    scriptGenerated,
    handleProcessResearch,
    handleGenerateScript,
    showHistory,
    setShowHistory,
    scrollToSection,
    hookTemplates,
    styleTemplates
  };
};
