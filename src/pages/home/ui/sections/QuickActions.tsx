import { Card, CardContent, CardHeader, CardTitle, Button } from 'shared/ui';
import { FileText, ListTodo, Calendar, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useFormNavigation, FormQuery } from 'shared/lib';

export const QuickActions = () => {
  const navigate = useNavigate();
  const openForm = useFormNavigation();

  const actions = [
    {
      icon: <FileText className="h-5 w-5" />,
      label: 'Создать документ',
      description: 'Новое заявление или приказ',
      onClick: () => openForm(FormQuery.CREATE_DOCUMENT),
      variant: 'default' as const,
    },
    {
      icon: <ListTodo className="h-5 w-5" />,
      label: 'Создать задачу',
      description: 'Поставить задачу сотруднику',
      onClick: () => openForm(FormQuery.CREATE_TASK),
      variant: 'outline' as const,
    },
    {
      icon: <Calendar className="h-5 w-5" />,
      label: 'Открыть расписание',
      description: 'Посмотреть занятия',
      onClick: () => navigate('/schedule'),
      variant: 'outline' as const,
    },
  ];

  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5 text-primary" />
          Быстрые действия
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {actions.map((action, index) => (
          <Button
            key={index}
            onClick={action.onClick}
            variant={action.variant}
            className="w-full justify-start h-auto py-4 px-4"
          >
            <div className="flex items-start gap-3 w-full">
              <div className="mt-0.5">{action.icon}</div>
              <div className="text-left flex-1">
                <div className="font-semibold">{action.label}</div>
                <div className="text-xs text-muted-foreground font-normal mt-0.5">
                  {action.description}
                </div>
              </div>
            </div>
          </Button>
        ))}
      </CardContent>
    </Card>
  );
};
