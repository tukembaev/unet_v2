import { TaskSearchFilter, TaskTabsContent } from 'entities/task'
import { CreateTaskDialog } from 'features/create-task'
import { useCallback, useState } from 'react'
import { PageHeader } from 'widgets/page-header'

export const TaskPage = () => {
  const [selectedFilters, setSelectedFilters] = useState<string[]>(['all'])


  const handleSearch = useCallback((value: string) => {
    // TODO: Implement search functionality
    console.log('Search:', value)
  }, [])

  const handleFiltersChange = useCallback((filters: string[]) => {
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
        
        <TaskTabsContent selectedFilters={selectedFilters} />
        
        <CreateTaskDialog />
    </div>
  )
}