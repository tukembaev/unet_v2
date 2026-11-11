function messageFromUnknown(value: unknown): string | null {
  if (typeof value === 'string' && value.trim()) return value;
  if (Array.isArray(value) && value.length > 0) {
    return messageFromUnknown(value[0]);
  }
  if (value && typeof value === 'object' && 'message' in value) {
    return messageFromUnknown((value as { message: unknown }).message);
  }
  return null;
}

/** Сообщение из Axios/сети для toast и UI */
export function getHttpErrorMessage(e: unknown, fallback = 'Произошла ошибка'): string {
  if (typeof e === 'object' && e !== null && 'response' in e) {
    const data = (e as { response?: { data?: unknown } }).response?.data;
    if (typeof data === 'string') return data;
    if (Array.isArray(data)) {
      const fromArray = messageFromUnknown(data);
      if (fromArray) return fromArray;
    }
    if (data && typeof data === 'object') {
      if ('detail' in data && data.detail != null) {
        const detail = data.detail;
        if (typeof detail === 'string') return detail;
        // FastAPI: detail: [{ msg, ... }] или [{ message: [...] }]
        const fromDetail = messageFromUnknown(detail);
        if (fromDetail) return fromDetail;
        if (Array.isArray(detail)) {
          const msgs = detail
            .map((item) =>
              item && typeof item === 'object' && 'msg' in item
                ? String((item as { msg: unknown }).msg)
                : null
            )
            .filter(Boolean);
          if (msgs.length) return msgs.join('; ');
        }
        return String(detail);
      }
      if ('message' in data && data.message != null) {
        const msg = messageFromUnknown(data.message);
        if (msg) return msg;
      }
      if ('non_field_errors' in data && Array.isArray((data as { non_field_errors: unknown }).non_field_errors)) {
        const arr = (data as { non_field_errors: string[] }).non_field_errors;
        return arr.join(' ');
      }
      const fieldMessages = Object.values(data as Record<string, unknown>)
        .map((value) => (Array.isArray(value) ? messageFromUnknown(value) : null))
        .filter((value): value is string => Boolean(value));
      if (fieldMessages.length) return fieldMessages.join('; ');
    }
  }
  if (e instanceof Error) return e.message;
  return fallback;
}
