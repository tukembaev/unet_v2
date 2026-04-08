import { TaskSearchFilter, TaskTabsContent, TaskFilters } from 'entities/task'
import { CreateTaskDialog } from 'features/create-task'
import { useCallback, useState } from 'react'
import { motion } from 'motion/react'
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
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
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
    </motion.div>
  )
}