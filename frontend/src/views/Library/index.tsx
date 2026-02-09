import { LibraryContainer } from '@/containers/Library';
import { PageContainer } from '@/components/PageContainer';
import { PageHeader } from '@/components/PageHeader';
import { AddNewItem } from '@/containers/Library/components/AddNewItem';
import { useLibraryController } from '@/containers/Library/controller';

export const LibraryView = () => {
  const { addHook, addTemplate } = useLibraryController();

  return (
    <PageContainer>
      <PageHeader
        title='Library'
        description='Manage your creative assets, hooks, and script structures.'
        actions={
          <AddNewItem
            onAddHook={async (data) => {
              try {
                await addHook(data);
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
          />
        }
      />
      <LibraryContainer />
    </PageContainer>
  );
};
