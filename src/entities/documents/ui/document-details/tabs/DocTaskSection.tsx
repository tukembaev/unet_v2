import { Card, CardHeader, CardTitle, CardContent } from "shared/ui";
import { Button } from "shared/ui";

const DocTaskSection = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Задачи по обращению</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="border p-3 rounded-lg">
          <p className="font-medium">Проверить корректность данных</p>
          <p className="text-sm text-muted-foreground">Статус: в процессе</p>
          <Button variant="secondary" size="sm" className="mt-2">
            Открыть задачу
          </Button>
        </div>
        <div className="border p-3 rounded-lg">
          <p className="font-medium">Согласовать с ректором</p>
          <p className="text-sm text-muted-foreground">Статус: ожидает</p>
          <Button variant="secondary" size="sm" className="mt-2">
            Открыть задачу
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DocTaskSection;
