import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "shared/ui";
import { DirectionCard } from "./DirectionCard";
import { useKindDirections } from "entities/education-management/model/queries";

export const FamiliesTab = () => {
  const [activeTab, setActiveTab] = useState("1");
  
  // Map activeTab to kind value
  const getKindFromTab = (tab: string): number => {
    const tabKindMap: Record<string, number> = {
      "10": 10, // Информационные технологии
      "12": 12, // Экономические направления
      "13": 13, // Дизайн, искусство, архитектура
      "11": 11, // Технические направления
    };
    return tabKindMap[tab] || 10;
  };

  const { data: kindDirections, isLoading, error } = useKindDirections(getKindFromTab(activeTab));

  if (isLoading) {
    return <div className="flex justify-center p-4">Загрузка...</div>;
  }

  if (error) {
    return <div className="flex justify-center p-4 text-red-500">Ошибка загрузки данных</div>;
  }

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="inline-flex h-auto w-auto flex-wrap gap-1 p-1">
          <TabsTrigger value="10" className="flex-shrink-0">
            Информационные технологии
          </TabsTrigger>
          <TabsTrigger value="12" className="flex-shrink-0">
            Экономические направления
          </TabsTrigger>
          <TabsTrigger value="13" className="flex-shrink-0">
            Дизайн, искусство, архитектура
          </TabsTrigger>
          <TabsTrigger value="11" className="flex-shrink-0">
            Технические направления
          </TabsTrigger>
        </TabsList>

        <TabsContent value="1" className="mt-4">
          <DirectionCard
            title="Информационные технологии"
            data={kindDirections?.direction || []}
          />
        </TabsContent>

        <TabsContent value="2" className="mt-4">
          <DirectionCard
            title="Экономические направления"
            data={kindDirections?.direction || []}
          />
        </TabsContent>

        <TabsContent value="3" className="mt-4">
          <DirectionCard
            title="Дизайн, искусство, архитектура"
            data={kindDirections?.direction || []}
          />
        </TabsContent>

        <TabsContent value="4" className="mt-4">
          <DirectionCard
            title="Технические направления"
            data={kindDirections?.direction || []}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
