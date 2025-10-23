import { Card, CardHeader, CardTitle, CardContent } from "shared/ui";

const DocFileCard = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Карточка документа</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="font-semibold">Тип документа:</p>
          <p>Заявление</p>
        </div>
        <div>
          <p className="font-semibold">Дата поступления:</p>
          <p>05.08.2025 17:47</p>
        </div>
        <div>
          <p className="font-semibold">Номер исходящего документа:</p>
          <p>DOC - 2025-08-054063</p>
        </div>
        <div>
          <p className="font-semibold">Сведения об исходящем</p>
          <div className="mt-2">
            <p>
              <span className="font-medium">Отправитель:</span> Сманов Мадияр
              777
            </p>
            <p>
              <span className="font-medium">Подписант:</span> Toga Inumaki 52
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DocFileCard;
