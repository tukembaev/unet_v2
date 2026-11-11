import { useEffect, useMemo, useState } from 'react';
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
import {
  Building2,
  ChevronLeft,
  ChevronRight,
  DoorOpen,
  FilterX,
  MapPin,
  RefreshCcw,
  Search,
} from 'lucide-react';
import {
  useAuditoryFundCampuses,
  useAuditoryFundKorpuses,
  useAuditoryFundRoomTypes,
  useAuditoryFundRooms,
} from '../model/queries';
import type { AuditoryFundRoom } from '../model/types';

const ALL = '__all__';
const PAGE_SIZE = 50;

export function AuditoryFundTable() {
  const [campusId, setCampusId] = useState<string>(ALL);
  const [korpusId, setKorpusId] = useState<string>(ALL);
  const [roomTypeSlug, setRoomTypeSlug] = useState<string>(ALL);
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [page, setPage] = useState(1);
  const [selectedRoom, setSelectedRoom] = useState<AuditoryFundRoom | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedQuery(query.trim());
      setPage(1);
    }, 350);
    return () => window.clearTimeout(timer);
  }, [query]);

  const selectedCampusId =
    campusId !== ALL && Number.isFinite(Number(campusId))
      ? Number(campusId)
      : null;
  const selectedKorpusId =
    korpusId !== ALL && Number.isFinite(Number(korpusId))
      ? Number(korpusId)
      : undefined;

  const roomsParams = useMemo(
    () => ({
      page,
      page_size: PAGE_SIZE,
      ...(selectedCampusId != null ? { campus: selectedCampusId } : {}),
      ...(selectedKorpusId != null ? { korpus: selectedKorpusId } : {}),
      ...(roomTypeSlug !== ALL ? { room_type: roomTypeSlug } : {}),
      ...(debouncedQuery ? { search: debouncedQuery } : {}),
    }),
    [page, selectedCampusId, selectedKorpusId, roomTypeSlug, debouncedQuery]
  );

  const campusesQuery = useAuditoryFundCampuses();
  const korpusesQuery = useAuditoryFundKorpuses(selectedCampusId);
  const roomTypesQuery = useAuditoryFundRoomTypes();
  const roomsQuery = useAuditoryFundRooms(roomsParams);

  const rooms = roomsQuery.data?.results ?? [];
  const totalCount = roomsQuery.data?.count ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  const isLoading =
    roomsQuery.isLoading ||
    campusesQuery.isLoading ||
    roomTypesQuery.isLoading;
  const errorMessage =
    roomsQuery.error instanceof Error
      ? roomsQuery.error.message
      : campusesQuery.error instanceof Error
        ? campusesQuery.error.message
        : roomTypesQuery.error instanceof Error
          ? roomTypesQuery.error.message
          : undefined;

  const resetFilters = () => {
    setCampusId(ALL);
    setKorpusId(ALL);
    setRoomTypeSlug(ALL);
    setQuery('');
    setDebouncedQuery('');
    setPage(1);
  };

  const activeFiltersCount = [
    campusId,
    korpusId,
    roomTypeSlug,
    debouncedQuery,
  ].filter((v) => v && v !== ALL).length;

  const refresh = () => {
    void Promise.all([
      campusesQuery.refetch(),
      roomTypesQuery.refetch(),
      roomsQuery.refetch(),
      selectedCampusId != null ? korpusesQuery.refetch() : Promise.resolve(),
    ]);
  };

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
            Найдено: {totalCount}
          </Badge>
          <Button
            variant="outline"
            onClick={refresh}
            disabled={roomsQuery.isFetching}
          >
            <RefreshCcw
              className={`mr-2 h-4 w-4 ${roomsQuery.isFetching ? 'animate-spin' : ''}`}
            />
            Обновить
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 p-4 sm:p-6">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-5">
          <Select
            value={campusId}
            onValueChange={(value) => {
              setCampusId(value);
              setKorpusId(ALL);
              setPage(1);
            }}
          >
            <SelectTrigger>
              <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
              <SelectValue placeholder="Кампус" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>Все кампусы</SelectItem>
              {(campusesQuery.data ?? []).map((campus) => (
                <SelectItem key={campus.id} value={String(campus.id)}>
                  {campus.cumpus}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={korpusId}
            onValueChange={(value) => {
              setKorpusId(value);
              setPage(1);
            }}
            disabled={selectedCampusId == null}
          >
            <SelectTrigger>
              <Building2 className="mr-2 h-4 w-4 text-muted-foreground" />
              <SelectValue
                placeholder={
                  selectedCampusId == null
                    ? 'Сначала выберите кампус'
                    : 'Корпус'
                }
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>Все корпуса</SelectItem>
              {(korpusesQuery.data ?? []).map((korpus) => (
                <SelectItem key={korpus.id} value={String(korpus.id)}>
                  {korpus.korpus}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={roomTypeSlug}
            onValueChange={(value) => {
              setRoomTypeSlug(value);
              setPage(1);
            }}
          >
            <SelectTrigger>
              <DoorOpen className="mr-2 h-4 w-4 text-muted-foreground" />
              <SelectValue placeholder="Спецификация" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>Все спецификации</SelectItem>
              {(roomTypesQuery.data ?? []).map((roomType) => (
                <SelectItem key={roomType.id} value={roomType.slug}>
                  {roomType.name_ru || roomType.slug}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Поиск по номеру, названию, кафедре"
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
                    <TableCell>
                      <Skeleton className="h-4 w-8" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-10" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-14" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-24 rounded-full" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-[220px] max-w-full" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-[180px] max-w-full" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : rooms.length === 0 ? (
          <Empty className="border border-dashed py-10">
            <EmptyTitle>Ничего не найдено</EmptyTitle>
            <EmptyDescription>
              Измените фильтры или строку поиска.
            </EmptyDescription>
          </Empty>
        ) : (
          <div className="space-y-4">
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
                  {rooms.map((item) => (
                    <TableRow
                      key={item.id}
                      onClick={() => setSelectedRoom(item)}
                      className="cursor-pointer transition-colors hover:bg-muted/40"
                    >
                      <TableCell>{item.cumpus || '—'}</TableCell>
                      <TableCell>{item.korpus || '—'}</TableCell>
                      <TableCell>
                        {item.num_audit || item.name2 || '—'}
                      </TableCell>
                      <TableCell>
                        {item.room_type_name || '—'}
                      </TableCell>
                      <TableCell>{item.nameRU || '—'}</TableCell>
                      <TableCell>{item.department || '—'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-muted-foreground">
                Страница {page} из {totalPages}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={page <= 1 || roomsQuery.isFetching}
                  onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                >
                  <ChevronLeft className="mr-1 h-4 w-4" />
                  Назад
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={
                    page >= totalPages ||
                    !roomsQuery.data?.next ||
                    roomsQuery.isFetching
                  }
                  onClick={() => setPage((prev) => prev + 1)}
                >
                  Вперёд
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>

      <Dialog
        open={selectedRoom !== null}
        onOpenChange={(open) => !open && setSelectedRoom(null)}
      >
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
              <DetailRow
                label="Корпус"
                value={String(selectedRoom.korpus ?? '—')}
              />
              <DetailRow
                label="Спецификация"
                value={selectedRoom.room_type_name ?? undefined}
              />
              <DetailRow label="Наименование (RU)" value={selectedRoom.nameRU} />
              <DetailRow label="Наименование (KG)" value={selectedRoom.nameKG} />
              <DetailRow
                label="Наименование (ENG)"
                value={selectedRoom.nemeENG}
              />
              <DetailRow
                label="Кафедра"
                value={selectedRoom.department ?? undefined}
              />
              <DetailRow
                label="Институт"
                value={selectedRoom.institute ?? undefined}
              />
              <DetailRow
                label="Ответственный"
                value={selectedRoom.Responsible ?? undefined}
              />
              <DetailRow
                label="Телефон"
                value={selectedRoom.numResponsible ?? undefined}
              />
              <DetailRow
                label="Вместимость"
                value={selectedRoom.capacity ?? undefined}
              />
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
      <div className="text-xs uppercase tracking-wide text-muted-foreground">
        {label}
      </div>
      <div className="mt-1 font-medium">
        {value && value.trim() ? value : '—'}
      </div>
    </div>
  );
}
