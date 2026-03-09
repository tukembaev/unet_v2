import { useState, useCallback } from 'react'
import { PageHeader } from 'widgets/page-header'
import { TaskSearchFilter, TaskTabsContent, CreateTaskDialog } from 'entities/task'

export const TaskPage = () => {
  const [selectedFilters, setSelectedFilters] = useState<string[]>(['all'])
  const [isCreateTaskDialogOpen, setIsCreateTaskDialogOpen] = useState(false)

  const handleSearch = useCallback((value: string) => {
    // TODO: Implement search functionality
    console.log('Search:', value)
  }, [])

  const handleFiltersChange = useCallback((filters: string[]) => {
    setSelectedFilters(filters)
  }, [])

  const handleAddTask = useCallback(() => {
    setIsCreateTaskDialogOpen(true)
  }, [])

  return (
    <div className="space-y-6">
        <PageHeader
          title="Задачи"
          description="Кыргызский Государственный Технический Университет имени И.Раззакова"
        >
          <TaskSearchFilter
            onSearch={handleSearch}
            selectedFilters={selectedFilters}
            onFiltersChange={handleFiltersChange}
            onAddTask={handleAddTask}
          />
        </PageHeader>
        
        <TaskTabsContent selectedFilters={selectedFilters} />
        
        <CreateTaskDialog
          open={isCreateTaskDialogOpen}
          onOpenChange={setIsCreateTaskDialogOpen}
        />
    </div>
  )
}