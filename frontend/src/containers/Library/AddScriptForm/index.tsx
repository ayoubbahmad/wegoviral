import { Modal } from '@/components/Modal';
import { ScriptForm } from './components/ScriptForm';
import { useAddScriptController } from './controller';
import { ScriptTemplate } from '../types';

interface AddScriptFormProps {
  onAddScript?: (script: any) => Promise<{ success: boolean; error?: string }>;
  onUpdateScript?: (
    id: string,
    script: any,
  ) => Promise<{ success: boolean; error?: string }>;
  editItem?: ScriptTemplate | null;
}

export function AddScriptForm(props: AddScriptFormProps) {
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
      title={isEditing ? 'Edit Script Template' : 'Add New Script Template'}
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
