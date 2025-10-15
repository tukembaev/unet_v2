import { useDisciplineTemplates } from "entities/education-management/model/queries";
import { useState } from "react";
import { AsyncSelect } from "shared/components/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Tabs, TabsContent, TabsList, TabsTrigger } from "shared/ui";
import { DisciplinesGrid } from "./DisciplinesGrid";


const staticOptions = [
  { id: "bachelor", name: "Бакалавр" },
  { id: "magistr", name: "Магистр" },
  { id: "special", name: "Специалист" },
  { id: "PhD", name: "PhD" },
];

export const DisciplinesTab = () => {
  const [activeTab, setActiveTab] = useState("1");
  const [levelEducation, setLevelEducation] = useState("");
  
  // Map activeTab to kind value
  const getKindFromTab = (tab: string): number => {
    const tabKindMap: Record<string, number> = {
      "1": 1, // Информационные технологии
      "2": 2, // Экономические направления
      "3": 3, // Дизайн, искусство, архитектура
      "4": 4, // Технические направления
    };
    return tabKindMap[tab] || 1;
  };

  const { data: disciplines, isLoading, error } = useDisciplineTemplates(
    levelEducation,
    getKindFromTab(activeTab)
  );

  const fetchStaticData = async (query?: string) => {
    await new Promise((res) => setTimeout(res, 200)); // просто для имитации загрузки
    if (!query) return staticOptions;
    return staticOptions.filter((o) =>
      o.name.toLowerCase().includes(query.toLowerCase())
    );
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex flex-col gap-2"> 
            <CardTitle>Дисциплины для семейств</CardTitle>
            <CardDescription>
              Управление дисциплинами, относящимися к семействам
            </CardDescription>
          </div>
          <button
            type="button"
            className="ml-4 rounded bg-primary px-4 py-2 text-white text-sm font-medium hover:bg-primary/90 transition"
            // onClick={yourCreateTemplateHandler} // добавьте обработчик сюда при необходимости
          >
            Создать шаблон
          </button>
        </CardHeader>
        <CardContent className="space-y-4">
          <AsyncSelect
            fetcher={fetchStaticData}
            label="Специализация"
            value={levelEducation}
            onChange={setLevelEducation}
            renderOption={(option) => <span>{option.name}</span>}
            getOptionValue={(option) => option.id}
            getDisplayValue={(option) => option.name}
            placeholder="Выбери специализацию"
          />
          {levelEducation && (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="inline-flex h-auto w-auto flex-wrap gap-1 p-1">
              <TabsTrigger value="1" className="flex-shrink-0">
                Информационные технологии
              </TabsTrigger>
              <TabsTrigger value="4" className="flex-shrink-0">
                Экономические направления
              </TabsTrigger>
              <TabsTrigger value="3" className="flex-shrink-0">
                Дизайн, искусство, архитектура
              </TabsTrigger>
              <TabsTrigger value="2" className="flex-shrink-0">
                Технические направления
              </TabsTrigger>
            </TabsList>

            <TabsContent value="1" className="mt-4">
              <DisciplinesGrid 
                disciplines={disciplines || []} 
                isLoading={isLoading}
                error={error}
              />
            </TabsContent>

            <TabsContent value="2" className="mt-4">
              <DisciplinesGrid
                disciplines={disciplines || []} 
                isLoading={isLoading}
                error={error}
              />
            </TabsContent>

            <TabsContent value="3" className="mt-4">
              <DisciplinesGrid 
                disciplines={disciplines || []} 
                isLoading={isLoading}
                error={error}
              />
            </TabsContent>

            <TabsContent value="4" className="mt-4">
              <DisciplinesGrid 
                disciplines={disciplines || []} 
                isLoading={isLoading}
                error={error}
              />
            </TabsContent>
          </Tabs>
          )}
          
        </CardContent>
      </Card>
    </div>
  );
};
