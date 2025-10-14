
import { Discipline } from "entities/education-management/model/types";
import { DisciplineCard } from "./DisciplineCard";

interface DisciplinesGridProps {
  disciplines: Discipline[];
  isLoading?: boolean;
  error?: Error | null;
}

export const DisciplinesGrid = ({ disciplines, isLoading, error }: DisciplinesGridProps) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-500">Загрузка дисциплин...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-red-500">Ошибка загрузки: {error.message}</div>
      </div>
    );
  }

  if (!disciplines || disciplines.length === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-500">Дисциплины не найдены</div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {disciplines.map((discipline) => (
        <DisciplineCard
          key={discipline.id}
          discipline={discipline}
        />
      ))}
    </div>
  );
};
