import { Modal } from '@/components/Modal';
import { ScriptForm } from './components/ScriptForm';
import { useAddScriptController } from './controller';
import { ScriptTemplate } from '../types';
import { useT } from '@/i18n/provider';

interface AddScriptFormProps {
  onAddScript?: (script: any) => Promise<{ success: boolean; error?: string }>;
  onUpdateScript?: (
    id: string,
    script: any,
  ) => Promise<{ success: boolean; error?: string }>;
  editItem?: ScriptTemplate | null;
}

export function AddScriptForm(props: AddScriptFormProps) {
  const t = useT();
  const {
    isOpen,
    isEditing,
    tagInput,
    setTagInput,
    handleAddTag,
    handleRemoveTag,
    handleClose,
    form,
    onSubmit,
  } = useAddScriptController(props);

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={isEditing ? t('creator.library.editTemplate') : t('creator.library.addTemplate')}
    >
      <div className='max-h-[75vh] overflow-y-auto px-1'>
        <ScriptForm
          form={form}
          tagInput={tagInput}
          setTagInput={setTagInput}
          onAddTag={handleAddTag}
          onRemoveTag={handleRemoveTag}
          onSubmit={onSubmit}
        />
      </div>
    </Modal>
  );
}
