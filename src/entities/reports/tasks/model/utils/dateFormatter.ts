/**
 * Форматирует дату в RFC3339 формат для API
 * Пример: 2026-03-16T00:00:00Z
 */
export const formatDateToRFC3339 = (date: Date, isEndOfDay: boolean = false): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  if (isEndOfDay) {
    return `${year}-${month}-${day}T23:59:59Z`;
  }

  return `${year}-${month}-${day}T00:00:00Z`;
};

/**
 * Парсит дату из строки и возвращает объект Date
 */
export const parseDate = (dateString: string): Date => {
  return new Date(dateString);
};
