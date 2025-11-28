import { useReports } from "entities/education-management/model/queries";
import { Card, CardContent, CardDescription, CardHeader, CardTitle ,Skeleton} from "shared/ui";

import { ReportsTable } from "./ReportsTable";
import { EmptyInfo } from "shared/components";

export const ReportsTab = () => {
  const { data: reports, isLoading, error } = useReports();
  if (error) {
    return (
      <div className="space-y-4">
        <div className="text-red-500">Ошибка загрузки данных</div>
      </div>
    );
  }
  if (isLoading) {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Отчеты</CardTitle>
            <CardDescription>
              Генерация и просмотр отчетов по учебному процессу
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-4 mb-4">
                <Skeleton className="h-10 w-32" />
              </div>
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-8 w-80 mx-auto" />
              <div className="rounded-md border">
                <div className="p-4">
                  <div className="grid grid-cols-9 gap-4 mb-4">
                    {Array.from({ length: 9 }).map((_, i) => (
                      <Skeleton key={i} className="h-6" />
                    ))}
                  </div>
                  {Array.from({ length: 4 }).map((_, rowIndex) => (
                    <div key={rowIndex} className="grid grid-cols-9 gap-4 mb-2">
                      {Array.from({ length: 9 }).map((_, colIndex) => (
                        <Skeleton key={colIndex} className="h-8" />
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Отчеты</CardTitle>
          <CardDescription>
            Генерация и просмотр отчетов по учебному процессу
          </CardDescription>
        </CardHeader>
        <CardContent>
        
          
          {reports && reports.length > 0 ? (
            <ReportsTable data={reports} />
          ) : (
            <EmptyInfo withCard={false}/>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
