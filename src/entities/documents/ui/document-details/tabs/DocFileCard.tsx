import { Card, CardContent } from "shared/ui";
import { FileText, Calendar, Hash, User, FileSignature } from "lucide-react";

const DocFileCard = () => {
  return (
    <Card className="hover:shadow-md transition-all duration-200">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          Карточка документа
        </h3>
        
        <div className="space-y-4">
          {/* Type */}
          <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
            <FileText className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground font-medium mb-1">Тип документа</p>
              <p className="text-sm font-medium">Заявление</p>
            </div>
          </div>

          {/* Date */}
          <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
            <Calendar className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground font-medium mb-1">Дата поступления</p>
              <p className="text-sm font-medium">05.08.2025 17:47</p>
            </div>
          </div>

          {/* Document Number */}
          <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
            <Hash className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground font-medium mb-1">Номер исходящего документа</p>
              <p className="text-sm font-medium">DOC - 2025-08-054063</p>
            </div>
          </div>

          {/* Sender Info */}
          <div className="border-t pt-4">
            <p className="text-xs text-muted-foreground font-semibold mb-3">Сведения об исходящем</p>
            
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                <User className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground font-medium mb-1">Отправитель</p>
                  <p className="text-sm font-medium">Сманов Мадияр 777</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                <FileSignature className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground font-medium mb-1">Подписант</p>
                  <p className="text-sm font-medium">Toga Inumaki 52</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DocFileCard;
