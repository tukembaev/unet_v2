import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger, Button } from 'shared/ui';
import { GenericDataTable, ColumnConfig } from './GenericDataTable';
import { GenericFilter, FilterGroup } from './GenericFilter';

export interface TabConfig {
  value: string;
  label: string;
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
            <TabsList>
              {tabs.map((tab) => (
                <TabsTrigger key={tab.value} value={tab.value}>
                  {tab.label}
                </TabsTrigger>
              ))}
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
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

