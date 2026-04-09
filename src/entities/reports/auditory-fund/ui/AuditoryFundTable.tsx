import { useMemo, useState } from 'react';
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Empty,
  EmptyDescription,
  EmptyTitle,
  Input,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from 'shared/ui';
import { Building2, DoorOpen, FilterX, MapPin, RefreshCcw, Search } from 'lucide-react';
import type { AuditoryFundRoom } from '../model/types';

interface AuditoryFundTableProps {
  rooms: AuditoryFundRoom[];
  isLoading: boolean;
  errorMessage?: string;
  onRefresh: () => void;
  isRefreshing?: boolean;
}

const ALL = '__all__';

export function AuditoryFundTable({
  rooms,
  isLoading,
  errorMessage,
  onRefresh,
  isRefreshing,
}: AuditoryFundTableProps) {
  const [campus, setCampus] = useState<string>(ALL);
  const [building, setBuilding] = useState<string>(ALL);
  const [specificity, setSpecificity] = useState<string>(ALL);
  const [query, setQuery] = useState('');
  const [selectedRoom, setSelectedRoom] = useState<AuditoryFundRoom | null>(null);

  const campusOptions = useMemo(
    () =>
      Array.from(new Set(rooms.map((i) => i.cumpus?.trim()).filter(Boolean) as string[])).sort(),
    [rooms]
  );

  const buildingOptions = useMemo(() => {
    const scoped = campus === ALL ? rooms : rooms.filter((r) => (r.cumpus ?? '') === campus);
    return Array.from(
      new Set(scoped.map((i) => String(i.korpus ?? '').trim()).filter(Boolean))
    ).sort((a, b) => a.localeCompare(b));
  }, [rooms, campus]);

  const specificityOptions = useMemo(
    () =>
      Array.from(
        new Set(rooms.map((i) => i.specificity?.trim()).filter(Boolean) as string[])
      ).sort(),
    [rooms]
  );

  const filtered = useMemo(() => {
    const text = query.trim().toLowerCase();
    return rooms
      .filter((i) => (campus === ALL ? true : (i.cumpus ?? '') === campus))
      .filter((i) => (building === ALL ? true : String(i.korpus ?? '') === building))
      .filter((i) => (specificity === ALL ? true : (i.specificity ?? '') === specificity))
      .filter((i) => {
        if (!text) return true;
        const haystack = [
          i.cumpus,
          i.korpus,
          i.num_audit,
          i.specificity,
          i.nameRU,
          i.department,
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();
        return haystack.includes(text);
      });
  }, [rooms, campus, building, specificity, query]);

  const resetFilters = () => {
    setCampus(ALL);
    setBuilding(ALL);
    setSpecificity(ALL);
    setQuery('');
  };

  const activeFiltersCount = [campus, building, specificity, query.trim()].filter(
    (v) => v && v !== ALL
  ).length;

  return (
    <Card className="overflow-hidden border-border/70 shadow-sm">
      <CardHeader className="flex flex-col gap-4 border-b bg-muted/30 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <CardTitle className="text-xl">Аудиторный фонд</CardTitle>
          <p className="text-sm text-muted-foreground">
            Реестр аудиторий КГТУ с поиском и фильтрацией
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="h-8 px-3">
            Найдено: {filtered.length}
          </Badge>
          <Button variant="outline" onClick={onRefresh} disabled={isRefreshing}>
            <RefreshCcw
              className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`}
            />
            Обновить
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 p-4 sm:p-6">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-5">
          <Select value={campus} onValueChange={(v) => { setCampus(v); setBuilding(ALL); }}>
            <SelectTrigger>
              <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
              <SelectValue placeholder="Кампус" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>Все кампусы</SelectItem>
              {campusOptions.map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={building} onValueChange={setBuilding}>
            <SelectTrigger>
              <Building2 className="mr-2 h-4 w-4 text-muted-foreground" />
              <SelectValue placeholder="Корпус" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>Все корпуса</SelectItem>
              {buildingOptions.map((b) => (
                <SelectItem key={b} value={b}>{b}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={specificity} onValueChange={setSpecificity}>
            <SelectTrigger>
              <DoorOpen className="mr-2 h-4 w-4 text-muted-foreground" />
              <SelectValue placeholder="Спецификация" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>Все спецификации</SelectItem>
              {specificityOptions.map((s) => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Поиск по аудитории, названию, кафедре"
            className="lg:col-span-2"
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-muted-foreground">
            <Search className="mr-2 h-4 w-4" />
            {activeFiltersCount > 0
              ? `Активных фильтров: ${activeFiltersCount}`
              : 'Фильтры не применены'}
          </div>
          <Button variant="ghost" onClick={resetFilters}>
            <FilterX className="mr-2 h-4 w-4" />
            Сбросить
          </Button>
        </div>

        {errorMessage ? (
          <Empty className="border border-dashed py-10">
            <EmptyTitle>Не удалось загрузить данные</EmptyTitle>
            <EmptyDescription>{errorMessage}</EmptyDescription>
          </Empty>
        ) : isLoading ? (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Кампус</TableHead>
                  <TableHead>Корпус</TableHead>
                  <TableHead>Аудитория</TableHead>
                  <TableHead>Спецификация</TableHead>
                  <TableHead>Наименование</TableHead>
                  <TableHead>Кафедра</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.from({ length: 10 }).map((_, idx) => (
                  <TableRow key={idx}>
                    <TableCell><Skeleton className="h-4 w-8" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-10" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-14" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-24 rounded-full" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-[220px] max-w-full" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-[180px] max-w-full" /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : filtered.length === 0 ? (
          <Empty className="border border-dashed py-10">
            <EmptyTitle>Ничего не найдено</EmptyTitle>
            <EmptyDescription>Измените фильтры или строку поиска.</EmptyDescription>
          </Empty>
        ) : (
          <div className="rounded-md border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Кампус</TableHead>
                  <TableHead>Корпус</TableHead>
                  <TableHead>Аудитория</TableHead>
                  <TableHead>Спецификация</TableHead>
                  <TableHead>Наименование</TableHead>
                  <TableHead>Кафедра</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((item) => (
                  <TableRow
                    key={item.id}
                    onClick={() => setSelectedRoom(item)}
                    className="cursor-pointer transition-colors hover:bg-muted/40"
                  >
                    <TableCell>{item.cumpus || '—'}</TableCell>
                    <TableCell>{item.korpus || '—'}</TableCell>
                    <TableCell>{item.num_audit || item.name2 || '—'}</TableCell>
                    <TableCell>{item.specificity || '—'}</TableCell>
                    <TableCell>{item.nameRU || '—'}</TableCell>
                    <TableCell>{item.department || '—'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>

      <Dialog open={selectedRoom !== null} onOpenChange={(open) => !open && setSelectedRoom(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Аудитория {selectedRoom?.num_audit || selectedRoom?.name2 || '—'}
            </DialogTitle>
          </DialogHeader>

          {selectedRoom && (
            <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
              <DetailRow label="ID" value={String(selectedRoom.id)} />
              <DetailRow label="Кампус" value={selectedRoom.cumpus} />
              <DetailRow label="Корпус" value={String(selectedRoom.korpus ?? '—')} />
              <DetailRow label="Спецификация" value={selectedRoom.specificity} />
              <DetailRow label="Наименование (RU)" value={selectedRoom.nameRU} />
              <DetailRow label="Наименование (KG)" value={selectedRoom.nameKG} />
              <DetailRow label="Наименование (ENG)" value={selectedRoom.nemeENG} />
              <DetailRow label="Кафедра" value={selectedRoom.department} />
              <DetailRow label="Институт" value={selectedRoom.institute} />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
}

function DetailRow({ label, value }: { label: string; value?: string }) {
  return (
    <div className="rounded-md border bg-muted/20 p-3">
      <div className="text-xs uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="mt-1 font-medium">{value && value.trim() ? value : '—'}</div>
    </div>
  );
}
