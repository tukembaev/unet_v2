export type SupportApplicantType = 'student' | 'employee';

export type SupportApplicantDetails = {
  applicantType: SupportApplicantType;
  fullName: string;
  email: string;
  /** Студент */
  group?: string;
  /** Сотрудник */
  pin?: string;
  phone?: string;
  department?: string;
  institute?: string;
  position?: string;
  /** Текст проблемы от пользователя */
  message: string;
};

/** Собирает анкету + текст обращения в один `description` для бэка. */
export function composeSupportDescription(
  details: SupportApplicantDetails
): string {
  const lines: string[] = [];

  if (details.applicantType === 'student') {
    lines.push('Тип: Студент');
    lines.push(`ФИО: ${details.fullName.trim()}`);
    lines.push(`Email: ${details.email.trim()}`);
    lines.push(`Группа: ${(details.group ?? '').trim()}`);
  } else {
    lines.push('Тип: Сотрудник');
    lines.push(`ФИО: ${details.fullName.trim()}`);
    lines.push(`ПИН: ${(details.pin ?? '').trim()}`);
    lines.push(`Телефон: ${(details.phone ?? '').trim()}`);
    lines.push(`Кафедра: ${(details.department ?? '').trim()}`);
    lines.push(`Институт: ${(details.institute ?? '').trim()}`);
    lines.push(`Должность: ${(details.position ?? '').trim()}`);
    lines.push(`Email для ответа: ${details.email.trim()}`);
  }

  lines.push('');
  lines.push('---');
  lines.push('');
  lines.push(details.message.trim());

  return lines.join('\n');
}
