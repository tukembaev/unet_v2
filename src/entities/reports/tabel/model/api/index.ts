import { apiClient, apiUserClient } from 'shared/config';
import type {
  AbsenceType,
  AbsenceWritePayload,
  EmployeeAbsence,
  StructureUnitType,
  TabelDayCell,
  TabelDivisionOption,
  TabelEmployeeRow,
  TabelEmployeeSummary,
  TabelReportParams,
} from '../types';
import { toIsoDate } from '../types';

function toUnitType(raw: unknown): StructureUnitType | null {
  if (!raw || typeof raw !== 'object') return null;
  const item = raw as Record<string, unknown>;
  const value = String(item.unit_type ?? item.value ?? item.code ?? '').trim();
  const label = String(item.title ?? item.label ?? item.name ?? value).trim();
  if (!value) return null;
  return { value, label: label || value };
}

function toDivisionOption(raw: unknown): TabelDivisionOption | null {
  if (!raw || typeof raw !== 'object') return null;
  const item = raw as Record<string, unknown>;
  const value = String(item.id ?? item.value ?? '').trim();
  const label = String(
    item.label ?? item.name ?? item.title ?? item.abbreviation ?? value
  ).trim();
  if (!value) return null;
  return { value, label: label || value };
}

function dayNumber(dateDay: string | undefined, index: number): number {
  const match = dateDay?.match(/^(\d{1,2})[./]/);
  if (match) return Number(match[1]);
  return index + 1;
}

function optionalId(value: unknown): number | null {
  if (value == null || value === '') return null;
  const id = Number(value);
  return Number.isFinite(id) ? id : null;
}

function toDayCell(raw: Record<string, unknown>, index: number): TabelDayCell | null {
  const date_day = raw.date_day != null ? String(raw.date_day) : undefined;
  if (!date_day && raw.display == null && raw.working_time == null && raw.day == null) {
    return null;
  }
  return {
    day: raw.day != null ? Number(raw.day) : dayNumber(date_day, index),
    date_day,
    day_of_week: raw.day_of_week != null ? String(raw.day_of_week) : undefined,
    working_time: (raw.working_time as string | number | null) ?? null,
    display: raw.display != null ? String(raw.display) : null,
    short_code: raw.short_code != null ? String(raw.short_code) : null,
    absence_id: optionalId(raw.absence_id),
    absence_type_id: optionalId(raw.absence_type_id),
    status_info: raw.status_info != null ? String(raw.status_info) : undefined,
    auditorium: raw.auditorium != null ? String(raw.auditorium) : undefined,
  };
}

function summaryFromTabels(tabels: Record<string, unknown>[]): TabelEmployeeSummary {
  const hours = tabels.find((item) => 'working_count' in item);
  const days = tabels.find((item) => 'working_days' in item);
  const daily = tabels.filter((item) => item.date_day != null);
  return {
    working_hours: (hours?.working_count as string | number | null) ?? null,
    working_days: (days?.working_days as string | number | null) ?? null,
    start_date: daily[0]?.date_day != null ? String(daily[0].date_day) : null,
    end_date:
      daily[daily.length - 1]?.date_day != null
        ? String(daily[daily.length - 1].date_day)
        : null,
  };
}

function toAbsenceType(raw: unknown): AbsenceType | null {
  if (!raw || typeof raw !== 'object') return null;
  const item = raw as Record<string, unknown>;
  const id = optionalId(item.id);
  if (id == null) return null;
  return {
    id,
    title: String(item.title ?? item.name ?? ''),
    short_code: String(item.short_code ?? ''),
    is_active: item.is_active !== false,
  };
}

function toAbsence(raw: unknown): EmployeeAbsence | null {
  if (!raw || typeof raw !== 'object') return null;
  const item = raw as Record<string, unknown>;
  const id = optionalId(item.id);
  const employee = optionalId(item.employee);
  const absenceType = optionalId(item.absence_type);
  if (id == null || employee == null || absenceType == null) return null;
  return {
    id,
    employee,
    employee_name: String(item.employee_name ?? ''),
    absence_type: absenceType,
    absence_type_title: String(item.absence_type_title ?? ''),
    short_code: String(item.short_code ?? ''),
    date_from: toIsoDate(item.date_from != null ? String(item.date_from) : ''),
    date_to: toIsoDate(item.date_to != null ? String(item.date_to) : ''),
    comment: String(item.comment ?? ''),
  };
}

/**
 * tabels = дни с date_day и служебные итоги working_count / working_days.
 * Старый ответ: days[] + summary.
 */
function normalizeEmployee(raw: unknown): TabelEmployeeRow | null {
  if (!raw || typeof raw !== 'object') return null;
  const item = raw as Record<string, unknown>;

  let days: TabelDayCell[] = [];
  let summary: TabelEmployeeSummary = {
    working_days: null,
    working_hours: null,
    start_date: null,
    end_date: null,
  };

  if (Array.isArray(item.days) && item.summary && typeof item.summary === 'object') {
    days = (item.days as Record<string, unknown>[])
      .map((day, index) => toDayCell(day, index))
      .filter((day): day is TabelDayCell => day != null);
    const s = item.summary as Record<string, unknown>;
    summary = {
      working_days: (s.working_days as string | number | null) ?? null,
      working_hours:
        (s.working_hours as string | number | null) ??
        (s.working_count as string | number | null) ??
        null,
      start_date: (s.start_date as string | null) ?? null,
      end_date: (s.end_date as string | null) ?? null,
    };
  } else if (Array.isArray(item.tabels)) {
    const tabels = item.tabels.filter(
      (entry): entry is Record<string, unknown> =>
        Boolean(entry) && typeof entry === 'object'
    );
    days = tabels
      .filter((entry) => entry.date_day != null)
      .map((day, index) => toDayCell(day, index))
      .filter((day): day is TabelDayCell => day != null);
    summary = summaryFromTabels(tabels);
  }

  return {
    employee_id: optionalId(item.employee_id) ?? undefined,
    employee_name: String(item.employee_name ?? item.label ?? '—'),
    subdivision: String(item.subdivision ?? '—'),
    position_name: String(item.position_name ?? item.position ?? '—'),
    rate: (item.rate as string | number | null) ?? null,
    division_name:
      item.division_name != null ? String(item.division_name) : undefined,
    days,
    summary,
  };
}

export const tabelApi = {
  /** GET /structure-unit-types/ — типы структур */
  getUnitTypes: async (): Promise<StructureUnitType[]> => {
    const { data } = await apiClient.get<unknown>('structure-unit-types/');
    if (!Array.isArray(data)) return [];
    return data
      .map(toUnitType)
      .filter((item): item is StructureUnitType => item != null);
  },

  /** GET users /organizations/select?unit_type= — UUID структур */
  getOrganizations: async (
    unitType: string
  ): Promise<TabelDivisionOption[]> => {
    const { data } = await apiUserClient.get<unknown>('organizations/select', {
      params: { unit_type: unitType },
    });
    const list = Array.isArray(data)
      ? data
      : data &&
          typeof data === 'object' &&
          Array.isArray((data as { results?: unknown }).results)
        ? (data as { results: unknown[] }).results
        : [];
    return list
      .map(toDivisionOption)
      .filter((item): item is TabelDivisionOption => item != null);
  },

  /**
   * GET /report-tabel/{structureUuid}/{month}/?year=
   */
  getReport: async (
    params: TabelReportParams
  ): Promise<TabelEmployeeRow[]> => {
    const { data } = await apiClient.get<unknown>(
      `report-tabel/${params.divisionId}/${params.month}/`,
      { params: { year: params.year } }
    );
    if (!Array.isArray(data)) return [];
    return data
      .map(normalizeEmployee)
      .filter((item): item is TabelEmployeeRow => item != null);
  },

  /** GET /absence-types/ — только активные виды для селекта. */
  getAbsenceTypes: async (): Promise<AbsenceType[]> => {
    const { data } = await apiClient.get<unknown>('absence-types/');
    const list = Array.isArray(data)
      ? data
      : data &&
          typeof data === 'object' &&
          Array.isArray((data as { results?: unknown }).results)
        ? (data as { results: unknown[] }).results
        : [];
    return list
      .map(toAbsenceType)
      .filter((item): item is AbsenceType => item != null);
  },

  getAbsence: async (id: number): Promise<EmployeeAbsence> => {
    const { data } = await apiClient.get<unknown>(`absences/${id}/`);
    const absence = toAbsence(data);
    if (!absence) throw new Error('Не удалось прочитать пропуск');
    return absence;
  },

  createAbsence: async (payload: AbsenceWritePayload): Promise<EmployeeAbsence> => {
    const { data } = await apiClient.post<unknown>('absences/', payload);
    const absence = toAbsence(data);
    if (!absence) throw new Error('Не удалось сохранить пропуск');
    return absence;
  },

  updateAbsence: async (
    id: number,
    payload: Partial<AbsenceWritePayload>
  ): Promise<EmployeeAbsence> => {
    const { data } = await apiClient.patch<unknown>(`absences/${id}/`, payload);
    const absence = toAbsence(data);
    if (!absence) throw new Error('Не удалось сохранить пропуск');
    return absence;
  },

  deleteAbsence: async (id: number): Promise<void> => {
    await apiClient.delete(`absences/${id}/`);
  },
};
