import { Card, CardHeader, CardTitle, CardContent } from "shared/ui";

const DocumentHistory = () => {
  const history = [
    { date: "31.07.2025", action: "Документ создан", author: "Иванов И.И." },
    {
      date: "01.08.2025",
      action: "Отправлен на согласование",
      author: "Петров П.П.",
    },
    { date: "02.08.2025", action: "Одобрен", author: "Toga Inumaki" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>История документа</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {history.map((h, i) => (
            <li key={i} className="border-b pb-2">
              <p className="font-medium">{h.action}</p>
              <p className="text-sm text-muted-foreground">
                {h.author} — {h.date}
              </p>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default DocumentHistory;
