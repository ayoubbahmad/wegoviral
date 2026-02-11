import { LibraryContainer } from '@/containers/Library';
import { PageContainer } from '@/components/PageContainer';
import { PageHeader } from '@/components/PageHeader';
import { AssetFormContainer } from '@/containers/Library/forms/AssetForm';
import { useLibraryController } from '@/containers/Library/controller';
import { useLibraryStore } from '@/containers/Library/slice';
import { Button } from '@/components/Button';
import { Plus } from 'lucide-react';

export const LibraryView = () => {
  const { addHook, updateHook, addTemplate, updateTemplate, selectedItem } =
    useLibraryController();
  const setIsAdding = useLibraryStore((state) => state.setIsAdding);

  return (
    <PageContainer>
      <PageHeader
        title='Library'
        description='Manage your creative assets, hooks, and script structures.'
        actions={
          <Button
            onClick={() => setIsAdding(true)}
            leftIcon={<Plus className='w-4 h-4' />}
          >
            Add New Asset
          </Button>
        }
      />

      <AssetFormContainer
        onAddHook={async (data) => {
          try {
            await addHook(data);
            return { success: true };
          } catch (error: any) {
            return { success: false, error: error.message };
          }
        }}
        onUpdateHook={async (id, data) => {
          try {
            await updateHook({ id, data });
            return { success: true };
          } catch (error: any) {
            return { success: false, error: error.message };
          }
        }}
        onAddScript={async (data) => {
          try {
            await addTemplate(data);
            return { success: true };
          } catch (error: any) {
            return { success: false, error: error.message };
          }
        }}
        onUpdateScript={async (id, data) => {
          try {
            await updateTemplate({ id, data });
            return { success: true };
          } catch (error: any) {
            return { success: false, error: error.message };
          }
        }}
        editItem={selectedItem}
      />

      <LibraryContainer />
    </PageContainer>
  );
};
