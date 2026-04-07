import { TaskSearchFilter, TaskTabsContent, TaskFilters } from 'entities/task'
import { CreateTaskDialog } from 'features/create-task'
import { useCallback, useState } from 'react'
import { PageHeader } from 'widgets/page-header'

export const TaskPage = () => {
  const [selectedFilters, setSelectedFilters] = useState<TaskFilters>({
    roles: [],
  })
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = useCallback((value: string) => {
    setSearchQuery(value)
  }, [])

  const handleFiltersChange = useCallback((filters: TaskFilters) => {
    setSelectedFilters(filters)
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
  
          />
        </PageHeader>
        
        <TaskTabsContent 
          selectedFilters={selectedFilters}
          searchQuery={searchQuery}
        />
        
        <CreateTaskDialog />
    </div>
  )
}