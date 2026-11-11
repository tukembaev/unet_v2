import { useEffect, useState } from 'react';
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator,
  Badge,
} from 'shared/ui';
import type { FlowInfo } from 'entities/streams';
import {
  useSelectEmployees,
  useUpdateTeacher,
} from 'entities/streams/model/queries';
import { Loader2 } from 'lucide-react';

interface FlowInfoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  flow: FlowInfo | null;
  subjectId: number | string | null;
}

export const FlowInfoModal = ({
  open,
  onOpenChange,
  flow,
  subjectId,
}: FlowInfoModalProps) => {
  const departmentId = flow?.department_id ?? null;
  const { data: employees = [], isLoading: employeesLoading } =
    useSelectEmployees(open ? departmentId : null);
  const updateTeacher = useUpdateTeacher(subjectId);

  const [teacherId, setTeacherId] = useState<string>('');

  useEffect(() => {
    if (!open || !flow) {
      setTeacherId('');
      return;
    }
    setTeacherId(flow.teacher != null ? String(flow.teacher) : '');
  }, [open, flow]);

  if (!flow) return null;

  const handleSave = async () => {
    if (!teacherId) return;
    try {
      await updateTeacher.mutateAsync({
        flowId: flow.id,
        teacher: Number(teacherId),
      });
      onOpenChange(false);
    } catch {
      /* toast in mutation */
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Поток #{flow.number}
          </DialogTitle>
          <DialogDescription>
            Прикрепление преподавателя к потоку
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 text-sm">
          <div className="flex justify-between gap-3">
            <span className="text-muted-foreground">Предмет:</span>
            <span className="text-right font-medium">{flow.name_subject}</span>
          </div>

          <div className="flex justify-between gap-3">
            <span className="text-muted-foreground">Тип потока:</span>
            <Badge variant="secondary">{flow.stream_type}</Badge>
          </div>

          <div className="flex justify-between gap-3">
            <span className="text-muted-foreground">Статус:</span>
            <span
              className={`rounded-full border px-2 py-0.5 text-xs font-medium ${
                flow.status === 'Открыт'
                  ? 'border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-400'
                  : flow.status === 'В ожидании'
                    ? 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-400'
                    : flow.status === 'В диспетчерской'
                      ? 'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-400'
                      : 'border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-400'
              }`}
            >
              {flow.status}
            </span>
          </div>

          <div className="flex justify-between gap-3">
            <span className="text-muted-foreground">Вместимость:</span>
            <span>{flow.capacity}</span>
          </div>

          <Separator />

          <div className="space-y-2">
            <Label htmlFor="stream-teacher">Преподаватель</Label>
            {flow.teacher_name ? (
              <p className="text-sm text-muted-foreground">
                Сейчас: <span className="font-medium text-foreground">{flow.teacher_name}</span>
              </p>
            ) : null}
            <Select
              value={teacherId}
              onValueChange={setTeacherId}
              disabled={employeesLoading || updateTeacher.isPending}
            >
              <SelectTrigger id="stream-teacher">
                <SelectValue
                  placeholder={
                    employeesLoading
                      ? 'Загрузка преподавателей…'
                      : 'Выберите преподавателя'
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {employees.map((employee) => (
                  <SelectItem
                    key={employee.value}
                    value={String(employee.value)}
                  >
                    {employee.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {!employeesLoading && employees.length === 0 ? (
              <p className="text-xs text-muted-foreground">
                Нет сотрудников для кафедры этого потока
              </p>
            ) : null}
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={updateTeacher.isPending}
          >
            Отмена
          </Button>
          <Button
            type="button"
            onClick={() => void handleSave()}
            disabled={
              !teacherId ||
              updateTeacher.isPending ||
              (flow.teacher != null && String(flow.teacher) === teacherId)
            }
          >
            {updateTeacher.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            {flow.teacher_name ? 'Сменить преподавателя' : 'Прикрепить'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
