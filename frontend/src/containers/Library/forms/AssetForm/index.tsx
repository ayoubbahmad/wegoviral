'use client';

import { Modal } from '@/components/Modal';
import { HookForm } from './components/HookForm';
import { ScriptForm } from './components/ScriptForm';
import { useAssetFormController } from './controller';
import { Hook, ScriptTemplate } from '../../api/types';

interface AssetFormContainerProps {
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

export function AssetFormContainer(props: AssetFormContainerProps) {
  const {
    isOpen,
    isEditing,
    activeTab,
    setActiveTab,
    metadata,
    isFetchingMetadata,
    handleFetchMetadata,
    tagInput,
    setTagInput,
    handleAddTag,
    handleRemoveTag,
    handleClose,
    hookForm,
    scriptForm,
    onHookSubmit,
    onScriptSubmit,
  } = useAssetFormController(props);

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={
        isEditing
          ? `Edit ${activeTab === 'hook' ? 'Hook' : 'Script'}`
          : activeTab === 'hook'
            ? 'Add New Hook'
            : 'Add Script Template'
      }
    >
      <div className='max-h-[75vh] overflow-y-auto px-1'>
        {!isEditing && (
          <div className='flex bg-secondary p-1 rounded-lg mb-6 sticky top-0 z-10'>
            <button
              onClick={() => setActiveTab('hook')}
              className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${
                activeTab === 'hook'
                  ? 'bg-background shadow-sm text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Hook
            </button>
            <button
              onClick={() => setActiveTab('script')}
              className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${
                activeTab === 'script'
                  ? 'bg-background shadow-sm text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Script
            </button>
          </div>
        )}

        {activeTab === 'hook' ? (
          <HookForm
            form={hookForm}
            metadata={metadata}
            isFetchingMetadata={isFetchingMetadata}
            onFetchMetadata={handleFetchMetadata}
            tagInput={tagInput}
            setTagInput={setTagInput}
            onAddTag={(e) => handleAddTag(e, hookForm)}
            onRemoveTag={(tag) => handleRemoveTag(tag, hookForm)}
            onSubmit={onHookSubmit}
          />
        ) : (
          <ScriptForm
            form={scriptForm}
            tagInput={tagInput}
            setTagInput={setTagInput}
            onAddTag={(e) => handleAddTag(e, scriptForm)}
            onRemoveTag={(tag) => handleRemoveTag(tag, scriptForm)}
            onSubmit={onScriptSubmit}
          />
        )}
      </div>
    </Modal>
  );
}
