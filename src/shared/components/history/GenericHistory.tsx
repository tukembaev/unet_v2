import { Card, CardContent } from "shared/ui";
import { History, CheckCircle2, Send, FilePlus, Clock, XCircle, UserPlus } from "lucide-react";
import { LucideIcon } from "lucide-react";

// Общий тип истории
export type BaseHistory = {
  id: number;
  text: string;
  status: string | null;
  created_at: string;
  employee: number;
  employee_full_name?: string;
  order?: number;
  application?: number;
};

interface GenericHistoryProps {
  history: BaseHistory[] | undefined;
  isLoading: boolean;
  title: string;
  emptyMessage?: string;
}

// Функция для определения иконки и цвета на основе статуса и текста
const getHistoryStyle = (text: string, status: string | null): { icon: LucideIcon; color: string } => {
  const lowerText = text.toLowerCase();
  
  if (status === "Одобрено" || lowerText.includes("подписал") || lowerText.includes("одобрил")) {
    return { icon: CheckCircle2, color: "text-green-500" };
  }
  
  if (status === "В ожидании" || lowerText.includes("ожидании")) {
    return { icon: Clock, color: "text-yellow-500" };
  }
  
  if (lowerText.includes("создал") || lowerText.includes("создан")) {
    return { icon: FilePlus, color: "text-blue-500" };
  }
  
  if (lowerText.includes("назначил") || lowerText.includes("назначен")) {
    return { icon: UserPlus, color: "text-indigo-500" };
  }
  
  if (lowerText.includes("отправил") || lowerText.includes("резолюцию")) {
    return { icon: Send, color: "text-purple-500" };
  }
  
  if (status === "Отклонено" || lowerText.includes("отклон")) {
    return { icon: XCircle, color: "text-red-500" };
  }
  
  // По умолчанию
  return { icon: History, color: "text-gray-500" };
};

const GenericHistory = ({ 
  history, 
  isLoading, 
  title,
  emptyMessage = "История отсутствует"
}: GenericHistoryProps) => {
  if (isLoading) {
    return (
      <Card className="hover:shadow-md transition-all duration-200">
        <CardContent className="p-4 md:p-6">
          <div className="mb-4 flex items-center gap-2">
            <History className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">{title}</h3>
          </div>
          <div className="flex items-center justify-center py-8">
            <div className="animate-pulse text-muted-foreground">Загрузка истории...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!history || history.length === 0) {
    return (
      <Card className="hover:shadow-md transition-all duration-200">
        <CardContent className="p-4 md:p-6">
          <div className="mb-4 flex items-center gap-2">
            <History className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">{title}</h3>
          </div>
          <div className="flex items-center justify-center py-8 text-muted-foreground">
            {emptyMessage}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover:shadow-md transition-all duration-200">
      <CardContent className="p-4 md:p-6">
        <div className="mb-4 flex items-center gap-2">
          <History className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
        
        <div className="space-y-1">
          {history.map((item, index) => {
            const { icon: Icon, color } = getHistoryStyle(item.text, item.status);
            
            return (
              <div 
                key={item.id} 
                className="relative pl-8 pb-6 last:pb-0 group"
              >
                {/* Timeline line */}
                {index !== history.length - 1 && (
                  <div className="absolute left-3 top-6 bottom-0 w-0.5 bg-border" />
                )}
                
                {/* Icon circle */}
                <div className={`absolute left-0 top-0.5 p-1.5 rounded-full bg-background border-2 ${color} border-current`}>
                  <Icon className="h-3 w-3" />
                </div>
                
                {/* Content */}
                <div className="space-y-1">
                  <div className="flex items-start gap-2">
                    <p className="font-semibold text-sm flex-1">{item.text}</p>
                    {item.status && (
                      <span className={`text-xs px-2 py-0.5 rounded-full border ${
                        item.status === "Одобрено" ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-400 dark:border-green-800" :
                        item.status === "В ожидании" ? "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-400 dark:border-yellow-800" :
                        item.status === "Отклонено" ? "bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-400 dark:border-red-800" :
                        "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-950 dark:text-gray-400 dark:border-gray-800"
                      }`}>
                        {item.status}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {item.created_at}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default GenericHistory;

