import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Tabs, TabsContent, TabsList, TabsTrigger, Button } from 'shared/ui';
import { cn } from 'shared/lib/utils';
import { GenericDataTable, ColumnConfig } from './GenericDataTable';
import { GenericFilter, FilterGroup } from './GenericFilter';

export interface TabConfig {
  value: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export interface ButtonConfig {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  variant?: 'default' | 'outline';
  visible?: boolean;
}

interface GenericTabsContentProps<T> {
  tabs: TabConfig[];
  defaultTab: string;
  columns: ColumnConfig<T>[];
  data: T[] | undefined;
  isLoading: boolean;
  onTabChange: (tab: string) => void;
  filterGroups: FilterGroup[];
  onClearFilters: () => void;
  buttons?: ButtonConfig[];
  onRowClick?: (item: T) => void;
  emptyMessage?: string;
  getRowKey: (item: T) => string | number;
  loadingComponent: React.ReactNode;
}

export function GenericTabsContent<T>({
  tabs,
  defaultTab,
  columns,
  data,
  isLoading,
  onTabChange,
  filterGroups,
  onClearFilters,
  buttons = [],
  onRowClick,
  emptyMessage,
  getRowKey,
  loadingComponent,
}: GenericTabsContentProps<T>) {
  const [activeTab, setActiveTab] = useState(defaultTab);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    onTabChange(value);
  };

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <TabsList className="h-auto gap-2 rounded-xl p-1">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.value;
                const Icon = tab.icon;
                return (
                  <motion.div
                    key={tab.value}
                    layout
                    className={cn(
                      'flex h-9 items-center justify-center overflow-hidden rounded-md cursor-pointer',
                      isActive ? 'flex-1' : 'flex-none'
                    )}
                    onClick={() => handleTabChange(tab.value)}
                    initial={false}
                    animate={{
                      width: isActive ? 'auto' : 'auto'
                    }}
                    transition={{
                      type: 'spring',
                      stiffness: 400,
                      damping: 25
                    }}
                  >
                    <TabsTrigger value={tab.value} asChild>
                      <motion.div
                        className="flex h-9 w-full items-center justify-center gap-2 px-4"
                        animate={{ filter: 'blur(0px)' }}
                        exit={{ filter: 'blur(2px)' }}
                        transition={{ duration: 0.25, ease: 'easeOut' }}
                      >
                        {Icon && <Icon className="h-4 w-4 shrink-0" />}
                        <AnimatePresence initial={false} mode="wait">
                          <motion.span
                            key={tab.value}
                            className="font-medium whitespace-nowrap"
                            initial={{ opacity: 0.7, scale: 0.95 }}
                            animate={{ 
                              opacity: isActive ? 1 : 0.7, 
                              scale: isActive ? 1 : 0.95 
                            }}
                            transition={{ duration: 0.2, ease: 'easeOut' }}
                          >
                            {tab.label}
                          </motion.span>
                        </AnimatePresence>
                      </motion.div>
                    </TabsTrigger>
                  </motion.div>
                );
              })}
            </TabsList>
            <GenericFilter filterGroups={filterGroups} onClearAll={onClearFilters} />
          </div>

          {buttons.length > 0 && (
            <div className="flex gap-2 w-full sm:w-auto">
              {buttons.map((button, index) =>
                button.visible !== false ? (
                  <Button
                    key={index}
                    variant={button.variant || 'default'}
                    className="flex-1 sm:flex-initial"
                    onClick={button.onClick}
                  >
                    {button.icon}
                    <span className="hidden sm:inline">{button.label}</span>
                  </Button>
                ) : null
              )}
            </div>
          )}
        </div>

        {tabs.map((tab) => (
          <TabsContent key={tab.value} value={tab.value} className="mt-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {isLoading ? (
                loadingComponent
              ) : (
                <GenericDataTable
                  data={data || []}
                  columns={columns}
                  onRowClick={onRowClick}
                  emptyMessage={emptyMessage}
                  getRowKey={getRowKey}
                />
              )}
            </motion.div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

