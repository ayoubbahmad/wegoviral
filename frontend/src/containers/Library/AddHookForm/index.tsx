import { Modal } from '@/components/Modal';
import { HookForm } from './components/HookForm';
import { useAddHookController } from './controller';
import { Hook } from '../types';

interface AddHookFormProps {
  onAddHook?: (hook: any) => Promise<{ success: boolean; error?: string }>;
  onUpdateHook?: (
    id: string,
    hook: any,
  ) => Promise<{ success: boolean; error?: string }>;
  editItem?: Hook | null;
}

export function AddHookForm(props: AddHookFormProps) {
  const {
    isOpen,
    isEditing,
    metadata,
    isFetchingMetadata,
    handleFetchMetadata,
    tagInput,
    setTagInput,
    handleAddTag,
    handleRemoveTag,
    handleClose,
    form,
    onSubmit,
  } = useAddHookController(props);

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={isEditing ? 'Edit Hook' : 'Add New Hook'}
    >
      <div className='max-h-[75vh] overflow-y-auto px-1'>
        <HookForm
          form={form}
          metadata={metadata}
          isFetchingMetadata={isFetchingMetadata}
          onFetchMetadata={handleFetchMetadata}
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
