export type QuestionType =
  | 'teacher_choice'
  | 'single_choice'
  | 'multiple_choice'
  | 'rating'
  | 'text';

export const QUESTION_TYPE_LABELS: Record<QuestionType, string> = {
  teacher_choice: 'Выбор преподавателя',
  single_choice: 'Один вариант',
  multiple_choice: 'Несколько вариантов',
  rating: 'Оценка (шкала)',
  text: 'Свободный текст',
};

export type SurveyOptionOut = {
  id: string;
  text: string;
  order: number;
  value?: string | number | null;
};

export type SurveyQuestionOut = {
  id: string;
  type: QuestionType;
  text: string;
  order: number;
  is_required: boolean;
  options: SurveyOptionOut[];
  bank_question_id: string | null;
};

export type SurveyOut = {
  id: string;
  title: string;
  description: string | null;
  department_id: string | null;
  created_by: string | null;
  is_active: boolean;
  is_anonymous: boolean;
  share_token: string;
  questions: SurveyQuestionOut[];
  created_at: string | null;
  already_submitted?: boolean;
};

export type SurveyListResponse = {
  items: SurveyOut[];
  total: number;
};

export type SurveyOptionPayload = {
  text: string;
  order: number;
};

export type SurveyQuestionPayload = {
  type: QuestionType;
  text: string;
  order: number;
  is_required: boolean;
  bank_question_id?: number | string | null;
  options?: SurveyOptionPayload[];
};

export type SurveyPayload = {
  title: string;
  description?: string | null;
  department_id?: string | null;
  is_active: boolean;
  is_anonymous: boolean;
  questions: SurveyQuestionPayload[];
};

export type SurveyAnswerPayload = {
  question_id: number | string;
  teacher_id?: string;
  selected_option_id?: number | string;
  selected_option_ids?: Array<number | string>;
  text_answer?: string;
};

export type SurveyResponseAnswer = {
  question_id: string;
  selected_option_id: string | null;
  selected_option_ids: string[] | null;
  text_answer: string | null;
  teacher_id: string | null;
};

export type SurveyResponseOut = {
  id: string;
  survey_id: string;
  student_id: string | null;
  submitted_at: string | null;
  answers: SurveyResponseAnswer[];
};

export type QuestionCategory = {
  id: string;
  name: string;
};

export type BankQuestion = {
  id: string;
  text: string;
  type: QuestionType;
  category_id: string | null;
  category_name: string | null;
  options: SurveyOptionOut[];
  created_at: string | null;
};

export type BankQuestionPayload = {
  text: string;
  type: QuestionType;
  category_id?: number | string | null;
  options?: SurveyOptionPayload[];
};

export type DepartmentOption = {
  id: string;
  label: string;
  abbreviation?: string | null;
};

export type EmployeeOption = {
  id: string;
  label: string;
  position?: string | null;
};

/** Черновик вопроса в редакторе анкеты / банка */
export type QuestionDraft = {
  key: string;
  type: QuestionType;
  text: string;
  is_required: boolean;
  bank_question_id: string | null;
  options: string[];
};

export function hasOptions(type: QuestionType): boolean {
  return (
    type === 'single_choice' || type === 'multiple_choice' || type === 'rating'
  );
}
