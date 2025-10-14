import { Tabs, TabsContent, TabsList, TabsTrigger } from "shared/ui";
import { DirectionCard } from "./DirectionCard";

export const FamiliesTab = () => {
  // Данные для информационных технологий
  const itData = [
    { id: "IT001", code: "09.03.01", name: "Информатика и вычислительная техника" },
    { id: "IT002", code: "09.03.02", name: "Информационные системы и технологии" },
    { id: "IT003", code: "09.03.03", name: "Прикладная информатика" },
    { id: "IT004", code: "09.03.04", name: "Программная инженерия" },
    { id: "IT005", code: "09.03.05", name: "Информационно-аналитические системы безопасности" },
  ];

  // Данные для экономических направлений
  const economicsData = [
    { id: "EC001", code: "38.03.01", name: "Экономика" },
    { id: "EC002", code: "38.03.02", name: "Менеджмент" },
    { id: "EC003", code: "38.03.03", name: "Управление персоналом" },
    { id: "EC004", code: "38.03.04", name: "Государственное и муниципальное управление" },
    { id: "EC005", code: "38.03.05", name: "Бизнес-информатика" },
  ];

  // Данные для дизайна, искусства и архитектуры
  const designData = [
    { id: "DS001", code: "07.03.01", name: "Архитектура" },
    { id: "DS002", code: "07.03.02", name: "Реконструкция и реставрация архитектурного наследия" },
    { id: "DS003", code: "07.03.03", name: "Дизайн архитектурной среды" },
    { id: "DS004", code: "54.03.01", name: "Дизайн" },
    { id: "DS005", code: "54.03.02", name: "Декоративно-прикладное искусство и народные промыслы" },
  ];

  // Данные для технических направлений
  const technicalData = [
    { id: "TC001", code: "15.03.01", name: "Машиностроение" },
    { id: "TC002", code: "15.03.02", name: "Технологические машины и оборудование" },
    { id: "TC003", code: "15.03.03", name: "Прикладная механика" },
    { id: "TC004", code: "15.03.04", name: "Автоматизация технологических процессов и производств" },
    { id: "TC005", code: "15.03.05", name: "Конструкторско-технологическое обеспечение машиностроительных производств" },
  ];

  return (
    <div className="space-y-4">
      <Tabs defaultValue="it" className="w-full">
        <TabsList className="inline-flex h-auto w-auto flex-wrap gap-1 p-1">
          <TabsTrigger value="it" className="flex-shrink-0">
            Информационные технологии
          </TabsTrigger>
          <TabsTrigger value="economics" className="flex-shrink-0">
            Экономические направления
          </TabsTrigger>
          <TabsTrigger value="design" className="flex-shrink-0">
            Дизайн, искусство, архитектура
          </TabsTrigger>
          <TabsTrigger value="technical" className="flex-shrink-0">
            Технические направления
          </TabsTrigger>
        </TabsList>

        <TabsContent value="it" className="mt-4">
          <DirectionCard
            title="Информационные технологии"
            data={itData}
          />
        </TabsContent>

        <TabsContent value="economics" className="mt-4">
          <DirectionCard
            title="Экономические направления"
            data={economicsData}
          />
        </TabsContent>

        <TabsContent value="design" className="mt-4">
          <DirectionCard
            title="Дизайн, искусство, архитектура"
            data={designData}
          />
        </TabsContent>

        <TabsContent value="technical" className="mt-4">
          <DirectionCard
            title="Технические направления"
            data={technicalData}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
