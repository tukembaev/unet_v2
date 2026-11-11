import {
  useAudienceOccupancy,
  useCreateSchedules,
  useScheduleAudits,
  useScheduleCampuses,
  useScheduleKorpuses,
  useTeacherEmployment,
} from 'entities/education-management/model/queries';
import type {
  CreateScheduleSlot,
  ScheduleWeekType,
  ScheduleWeekday,
  WorkPlanItem,
} from 'entities/education-management/model/types';
import { ArrowLeft, Loader2, Users } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { ROUTES } from 'app/providers/routes';
import { getHttpErrorMessage } from 'shared/lib';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from 'shared/ui';
import {
  TIME_SLOT_OPTIONS,
  WEEK_TYPE_OPTIONS,
  WEEKDAY_OPTIONS,
  getStreamTeacherId,
} from './constants';
import { WeeklySchedule } from './WeeklySchedule';

type OneFlowProps = {
  stream: WorkPlanItem;
};

export function OneFlow({ stream }: OneFlowProps) {
  const teacherId = getStreamTeacherId(stream);
  const createSchedules = useCreateSchedules();

  const [weekday, setWeekday] = useState<ScheduleWeekday | ''>('');
  const [weekType, setWeekType] = useState<ScheduleWeekType>('weekly');
  const [time, setTime] = useState('');
  const [startWeek, setStartWeek] = useState('1');
  const [endWeek, setEndWeek] = useState('16');
  const [date, setDate] = useState('');
  const [campusId, setCampusId] = useState('');
  const [korpusId, setKorpusId] = useState('');
  const [auditId, setAuditId] = useState('');
  const [occupancyTick, setOccupancyTick] = useState(0);

  const campusesQuery = useScheduleCampuses();
  const korpusesQuery = useScheduleKorpuses(campusId || null);
  const auditsQuery = useScheduleAudits(korpusId || null);
  const teacherQuery = useTeacherEmployment(teacherId);
  const audienceQuery = useAudienceOccupancy(auditId || null);

  const campus = useMemo(
    () => (campusesQuery.data ?? []).find((item) => item.value === campusId),
    [campusesQuery.data, campusId]
  );
  const korpus = useMemo(
    () => (korpusesQuery.data ?? []).find((item) => item.value === korpusId),
    [korpusesQuery.data, korpusId]
  );
  const audit = useMemo(
    () => (auditsQuery.data ?? []).find((item) => item.value === auditId),
    [auditsQuery.data, auditId]
  );

  const backHref = `${ROUTES.EDUCATION_MANAGEMENT}?tab=dispatcher`;
  const studentsCount = stream.students_count ?? 0;
  const capacity = stream.capacity ?? 0;

  const resetGeoAfterCampus = (nextCampus: string) => {
    setCampusId(nextCampus);
    setKorpusId('');
    setAuditId('');
  };

  const resetGeoAfterKorpus = (nextKorpus: string) => {
    setKorpusId(nextKorpus);
    setAuditId('');
  };

  const handleSubmit = async () => {
    if (!weekday) {
      toast.error('Выберите день недели');
      return;
    }
    if (!time) {
      toast.error('Выберите время');
      return;
    }
    if (!weekType) {
      toast.error('Выберите вид недели');
      return;
    }
    const start = Number(startWeek);
    const end = Number(endWeek);
    if (!Number.isFinite(start) || !Number.isFinite(end) || start < 1 || end < start) {
      toast.error('Укажите корректный диапазон недель (от–до)');
      return;
    }
    if (!campus || !korpus || !audit) {
      toast.error('Выберите кампус, корпус и аудиторию');
      return;
    }

    const payload: CreateScheduleSlot[] = [
      {
        stream: stream.id,
        weekday,
        time,
        weeks: `${start}-${end}`,
        date: date.trim() || null,
        week_type: weekType,
        campus_qr_id: campus.value,
        campus_name: campus.label,
        korpus_qr_id: korpus.value,
        korpus_name: korpus.label,
        audit_qr_id: audit.value,
        audit_name: audit.label,
      },
    ];

    try {
      await createSchedules.mutateAsync(payload);
      toast.success('Пара успешно добавлена');
      setOccupancyTick((n) => n + 1);
      void teacherQuery.refetch();
      void audienceQuery.refetch();
    } catch (error) {
      toast.error(getHttpErrorMessage(error, 'Не удалось добавить пару'));
    }
  };

  return (
    <div className="flex min-h-0 flex-col gap-3">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-0 flex-1 items-start gap-3">
          <Button variant="outline" size="sm" className="shrink-0" asChild>
            <Link to={backHref}>
              <ArrowLeft className="mr-1.5 h-4 w-4" />
              Назад
            </Link>
          </Button>
          <div className="min-w-0 space-y-1">
            <h1 className="text-lg font-semibold leading-tight tracking-tight sm:text-xl">
              Поток {stream.number} — {stream.name_subject}
            </h1>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
              <span>{stream.stream_type}</span>
              {stream.teacher_name ? <span>· {stream.teacher_name}</span> : null}
              {stream.status ? <span>· {stream.status}</span> : null}
              <span className="inline-flex items-center gap-1 rounded-full border bg-muted/40 px-2 py-0.5 text-xs font-medium text-foreground">
                <Users className="h-3.5 w-3.5 text-muted-foreground" aria-hidden />
                {studentsCount} / {capacity || '—'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 xl:grid-cols-[minmax(320px,420px)_minmax(0,1fr)] xl:items-start">
        <Card className="overflow-hidden">
          <CardHeader className="space-y-0 border-b bg-muted/20 px-3 py-2.5 sm:px-4">
            <CardTitle className="text-sm font-semibold">Добавить пару</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 p-3 sm:p-4">
            <div className="grid grid-cols-2 gap-2.5">
              <div className="space-y-1">
                <Label className="text-xs">День</Label>
                <Select
                  value={weekday || undefined}
                  onValueChange={(value) => setWeekday(value as ScheduleWeekday)}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="День" />
                  </SelectTrigger>
                  <SelectContent>
                    {WEEKDAY_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label className="text-xs">Вид недели</Label>
                <Select
                  value={weekType}
                  onValueChange={(value) =>
                    setWeekType(value as ScheduleWeekType)
                  }
                >
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Вид недели" />
                  </SelectTrigger>
                  <SelectContent>
                    {WEEK_TYPE_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label className="text-xs">Время</Label>
                <Select value={time || undefined} onValueChange={setTime}>
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Слот" />
                  </SelectTrigger>
                  <SelectContent>
                    {TIME_SLOT_OPTIONS.map((slot) => (
                      <SelectItem key={slot} value={slot}>
                        {slot}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label className="text-xs">Дата</Label>
                <Input
                  type="date"
                  className="h-9"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs">Неделя с</Label>
                <Input
                  type="number"
                  min={1}
                  className="h-9"
                  value={startWeek}
                  onChange={(e) => setStartWeek(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs">Неделя по</Label>
                <Input
                  type="number"
                  min={1}
                  className="h-9"
                  value={endWeek}
                  onChange={(e) => setEndWeek(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
              <div className="space-y-1">
                <Label className="text-xs">Кампус</Label>
                <Select
                  value={campusId || undefined}
                  onValueChange={resetGeoAfterCampus}
                  disabled={campusesQuery.isLoading}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Кампус" />
                  </SelectTrigger>
                  <SelectContent>
                    {(campusesQuery.data ?? []).map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label className="text-xs">Корпус</Label>
                <Select
                  value={korpusId || undefined}
                  onValueChange={resetGeoAfterKorpus}
                  disabled={!campusId || korpusesQuery.isLoading}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue
                      placeholder={campusId ? 'Корпус' : 'Сначала кампус'}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {(korpusesQuery.data ?? []).map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label className="text-xs">Аудитория</Label>
                <Select
                  value={auditId || undefined}
                  onValueChange={setAuditId}
                  disabled={!korpusId || auditsQuery.isLoading}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue
                      placeholder={korpusId ? 'Аудитория' : 'Сначала корпус'}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {(auditsQuery.data ?? []).map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              onClick={() => void handleSubmit()}
              disabled={createSchedules.isPending}
              className="h-9 w-full"
            >
              {createSchedules.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Сохранение…
                </>
              ) : (
                'Добавить пару'
              )}
            </Button>
          </CardContent>
        </Card>

        <div key={occupancyTick} className="min-w-0">
          <Tabs defaultValue="teacher" className="space-y-2">
            <TabsList className="grid h-9 w-full grid-cols-2">
              <TabsTrigger value="teacher" className="text-xs sm:text-sm">
                Преподаватель
              </TabsTrigger>
              <TabsTrigger value="audience" className="text-xs sm:text-sm">
                Аудитория
              </TabsTrigger>
            </TabsList>
            <TabsContent value="teacher" className="mt-0">
              <WeeklySchedule
                title="Занятость преподавателя"
                data={teacherQuery.data}
                isLoading={teacherQuery.isLoading || teacherQuery.isFetching}
                emptyHint={
                  teacherId
                    ? 'Свободно — занятых слотов нет'
                    : 'У потока не указан преподаватель'
                }
              />
            </TabsContent>
            <TabsContent value="audience" className="mt-0">
              <WeeklySchedule
                title="Занятость аудитории"
                data={audienceQuery.data}
                isLoading={audienceQuery.isLoading || audienceQuery.isFetching}
                emptyHint={
                  auditId
                    ? 'Свободно — занятых слотов нет'
                    : 'Выберите аудиторию, чтобы увидеть занятость'
                }
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
