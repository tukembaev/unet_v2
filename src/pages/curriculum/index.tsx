import { useState } from 'react';
import { PageHeader } from 'widgets/page-header';
import { Input, Button } from 'shared/ui';
import { Plus, Search } from 'lucide-react';
import { CurriculumContent, CreateRupDialog } from 'entities/curriculum';

export const CurriculumPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const handleOpenDialog = () => {
    setIsCreateDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Учебный план и описание"
        description="Управление рабочими учебными программами"
      >
        <div className="flex items-center gap-4">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Поиск по направлению..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
          <Button onClick={handleOpenDialog}>
            <Plus className="h-4 w-4 mr-2" />
            Создать РУП
          </Button>
        </div>
      </PageHeader>

      <CurriculumContent searchQuery={searchQuery} />

      <CreateRupDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      />
    </div>
  );
};

