import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "shared/ui";

import { useFamilyDirection } from "entities/education-management/model/queries";
import { DirectionCard } from "./DirectionCard";
import { useKindDirections } from "entities/education-management/model/queries";

export const FamiliesTab = () => {
  const [activeTab, setActiveTab] = useState("it");
  
  // Map activeTab to kind value
  const getKindFromTab = (tab: string): number => {
    const tabKindMap: Record<string, number> = {
      "it": 10, // Информационные технологии
      "technical": 11, // Технические направления
      "economics": 12, // Экономические направления
      "design": 13, // Дизайн, искусство, архитектура
    };
    return tabKindMap[tab] || 10;
  };

  const { data: familyDirection, isLoading, error } = useFamilyDirection(
    getKindFromTab(activeTab)
  );
  
  // Преобразуем данные из API в формат для DirectionCard
  const getDirectionData = () => {
    if (!familyDirection?.direction) return [];
    return familyDirection.direction.map(item => ({
      id: item.id.toString(),
      code: item.cipher,
      name: item.direction_name
    }));
  };

  const getTabTitle = (tab: string): string => {
    const titleMap: Record<string, string> = {
      "it": "Информационные технологии",
      "technical": "Технические направления", 
      "economics": "Экономические направления",
      "design": "Дизайн, искусство, архитектура",
    };
    return titleMap[tab] || "Направления";
  };

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="inline-flex h-auto w-auto flex-wrap gap-1 p-1">
          <TabsTrigger value="10" className="flex-shrink-0">
            Информационные технологии
          </TabsTrigger>
          <TabsTrigger value="technical" className="flex-shrink-0">
            Технические направления
          </TabsTrigger>
          <TabsTrigger value="economics" className="flex-shrink-0">
            Экономические направления
          </TabsTrigger>
          <TabsTrigger value="13" className="flex-shrink-0">
            Дизайн, искусство, архитектура
          </TabsTrigger>
        </TabsList>

        <TabsContent value="1" className="mt-4">
          <DirectionCard
            title={getTabTitle("it")}
            data={getDirectionData()}
            isLoading={isLoading}
            error={error}
          />
        </TabsContent>

        <TabsContent value="technical" className="mt-4">
          <DirectionCard
            title={getTabTitle("technical")}
            data={getDirectionData()}
            isLoading={isLoading}
            error={error}
          />
        </TabsContent>

        <TabsContent value="economics" className="mt-4">
          <DirectionCard
            title={getTabTitle("economics")}
            data={getDirectionData()}
            isLoading={isLoading}
            error={error}
          />
        </TabsContent>

        <TabsContent value="design" className="mt-4">
          <DirectionCard
            title={getTabTitle("design")}
            data={getDirectionData()}
            isLoading={isLoading}
            error={error}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
