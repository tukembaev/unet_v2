/** Сообщение из Axios/сети для toast и UI */
export function getHttpErrorMessage(e: unknown, fallback = 'Произошла ошибка'): string {
  if (typeof e === 'object' && e !== null && 'response' in e) {
    const data = (e as { response?: { data?: unknown } }).response?.data;
    if (typeof data === 'string') return data;
    if (data && typeof data === 'object') {
      if ('detail' in data && data.detail != null) return String(data.detail);
      if ('message' in data && data.message != null) return String(data.message);
      if ('non_field_errors' in data && Array.isArray((data as { non_field_errors: unknown }).non_field_errors)) {
        const arr = (data as { non_field_errors: string[] }).non_field_errors;
        return arr.join(' ');
      }
    }
  }
  if (e instanceof Error) return e.message;
  return fallback;
}
