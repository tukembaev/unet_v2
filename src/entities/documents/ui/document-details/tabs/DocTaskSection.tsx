import { Card, CardContent, Button, Badge } from "shared/ui";
import { ClipboardList, ExternalLink, Clock, CheckCircle2 } from "lucide-react";

const DocTaskSection = () => {
  return (
    <Card className="hover:shadow-md transition-all duration-200">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <ClipboardList className="h-5 w-5 text-primary" />
          Задачи по обращению
        </h3>
        
        <div className="space-y-3">
          {/* Task 1 */}
          <div className="group p-4 rounded-lg border border-border hover:border-primary/50 hover:shadow-sm transition-all duration-200 bg-background">
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <p className="font-semibold text-sm flex-1">Проверить корректность данных</p>
                <Badge variant="secondary" className="flex items-center gap-1 shrink-0">
                  <Clock className="h-3 w-3" />
                  <span className="text-xs">В процессе</span>
                </Badge>
              </div>
              
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full justify-between group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
              >
                Открыть задачу
                <ExternalLink className="h-3 w-3" />
              </Button>
            </div>
          </div>

          {/* Task 2 */}
          <div className="group p-4 rounded-lg border border-border hover:border-primary/50 hover:shadow-sm transition-all duration-200 bg-background">
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <p className="font-semibold text-sm flex-1">Согласовать с ректором</p>
                <Badge variant="outline" className="flex items-center gap-1 shrink-0">
                  <CheckCircle2 className="h-3 w-3" />
                  <span className="text-xs">Ожидает</span>
                </Badge>
              </div>
              
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full justify-between group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
              >
                Открыть задачу
                <ExternalLink className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DocTaskSection;
