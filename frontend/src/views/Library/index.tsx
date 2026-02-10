import { LibraryContainer } from '@/containers/Library';
import { PageContainer } from '@/components/PageContainer';
import { PageHeader } from '@/components/PageHeader';
import { LibraryAssetModal } from '@/containers/Library/components/AddNewItem';
import { useLibraryController } from '@/containers/Library/controller';

export const LibraryView = () => {
  const { addHook, updateHook, addTemplate, updateTemplate, selectedItem } =
    useLibraryController();

  return (
    <PageContainer>
      <PageHeader
        title='Library'
        description='Manage your creative assets, hooks, and script structures.'
        actions={
          <LibraryAssetModal
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
        }
      />
      <LibraryContainer />
    </PageContainer>
  );
};
