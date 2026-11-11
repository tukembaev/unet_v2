import { apiUserClient } from 'shared/config';
import {
  apiSurveysClient,
  apiSurveysPublicClient,
} from 'shared/config/surveys_axios';
import type {
  BankQuestion,
  BankQuestionPayload,
  DepartmentOption,
  EmployeeOption,
  QuestionCategory,
  SurveyAnswerPayload,
  SurveyListResponse,
  SurveyOut,
  SurveyPayload,
  SurveyResponseOut,
} from './types';

function toId(value: unknown): string {
  return value == null ? '' : String(value);
}

function normalizeSurvey(raw: unknown): SurveyOut {
  const s = (raw ?? {}) as Record<string, unknown>;
  const questionsRaw = Array.isArray(s.questions) ? s.questions : [];
  return {
    id: toId(s.id),
    title: String(s.title ?? ''),
    description: (s.description as string | null) ?? null,
    department_id: s.department_id ? toId(s.department_id) : null,
    created_by: s.created_by ? toId(s.created_by) : null,
    is_active: Boolean(s.is_active),
    is_anonymous: Boolean(s.is_anonymous),
    share_token: String(s.share_token ?? ''),
    created_at: (s.created_at as string | null) ?? null,
    already_submitted:
      typeof s.already_submitted === 'boolean' ? s.already_submitted : undefined,
    questions: questionsRaw.map((qRaw) => {
      const q = qRaw as Record<string, unknown>;
      const optionsRaw = Array.isArray(q.options) ? q.options : [];
      return {
        id: toId(q.id),
        type: q.type as SurveyOut['questions'][number]['type'],
        text: String(q.text ?? ''),
        order: Number(q.order ?? 0),
        is_required: Boolean(q.is_required),
        bank_question_id: q.bank_question_id ? toId(q.bank_question_id) : null,
        options: optionsRaw.map((oRaw) => {
          const o = oRaw as Record<string, unknown>;
          return {
            id: toId(o.id),
            text: String(o.text ?? ''),
            order: Number(o.order ?? 0),
            value: (o.value as string | number | null) ?? null,
          };
        }),
      };
    }),
  };
}

function normalizeBankQuestion(raw: unknown): BankQuestion {
  const q = (raw ?? {}) as Record<string, unknown>;
  const optionsRaw = Array.isArray(q.options) ? q.options : [];
  return {
    id: toId(q.id),
    text: String(q.text ?? ''),
    type: q.type as BankQuestion['type'],
    category_id: q.category_id ? toId(q.category_id) : null,
    category_name: (q.category_name as string | null) ?? null,
    created_at: (q.created_at as string | null) ?? null,
    options: optionsRaw.map((oRaw) => {
      const o = oRaw as Record<string, unknown>;
      return {
        id: toId(o.id),
        text: String(o.text ?? ''),
        order: Number(o.order ?? 0),
        value: (o.value as string | number | null) ?? null,
      };
    }),
  };
}

/* ------------------------------ Анкеты ------------------------------ */

export async function fetchSurveys(params?: {
  department_id?: string;
  is_active?: boolean;
  skip?: number;
  limit?: number;
}): Promise<SurveyListResponse> {
  const { data } = await apiSurveysClient.get('surveys', {
    params: {
      skip: params?.skip ?? 0,
      limit: params?.limit ?? 100,
      ...(params?.department_id ? { department_id: params.department_id } : {}),
      ...(params?.is_active != null ? { is_active: params.is_active } : {}),
    },
  });
  const payload = (data ?? {}) as Record<string, unknown>;
  const items = Array.isArray(payload.items) ? payload.items : [];
  return {
    items: items.map(normalizeSurvey),
    total: Number(payload.total ?? items.length),
  };
}

export async function fetchSurvey(id: string): Promise<SurveyOut> {
  const { data } = await apiSurveysClient.get(`surveys/${id}`);
  return normalizeSurvey(data);
}

export async function createSurvey(
  payload: SurveyPayload
): Promise<SurveyOut> {
  const { data } = await apiSurveysClient.post('surveys', payload);
  return normalizeSurvey(data);
}

export async function updateSurvey(
  id: string,
  payload: Partial<SurveyPayload>
): Promise<SurveyOut> {
  const { data } = await apiSurveysClient.patch(`surveys/${id}`, payload);
  return normalizeSurvey(data);
}

export async function deleteSurvey(id: string): Promise<void> {
  await apiSurveysClient.delete(`surveys/${id}`);
}

export async function regenerateShareToken(id: string): Promise<SurveyOut> {
  const { data } = await apiSurveysClient.post(
    `surveys/${id}/share-token/regenerate`
  );
  return normalizeSurvey(data);
}

/* ----------------------------- Прохождение ----------------------------- */

export async function submitSurveyResponse(
  surveyId: string,
  answers: SurveyAnswerPayload[]
): Promise<SurveyResponseOut> {
  const { data } = await apiSurveysClient.post(
    `surveys/${surveyId}/responses`,
    { answers }
  );
  return data as SurveyResponseOut;
}

export async function fetchSurveyResponses(
  surveyId: string
): Promise<SurveyResponseOut[]> {
  const { data } = await apiSurveysClient.get(`surveys/${surveyId}/responses`);
  const payload = (data ?? {}) as Record<string, unknown>;
  const responses = Array.isArray(payload.responses)
    ? payload.responses
    : Array.isArray(data)
      ? data
      : [];
  return responses as SurveyResponseOut[];
}

/* ------------------------------- Публичные ------------------------------ */

export async function fetchPublicSurvey(
  shareToken: string
): Promise<SurveyOut> {
  const { data } = await apiSurveysPublicClient.get(
    `public/surveys/${shareToken}`
  );
  return normalizeSurvey(data);
}

export async function submitPublicSurveyResponse(
  shareToken: string,
  answers: SurveyAnswerPayload[]
): Promise<SurveyResponseOut> {
  const { data } = await apiSurveysPublicClient.post(
    `public/surveys/${shareToken}/responses`,
    { answers }
  );
  return data as SurveyResponseOut;
}

/* ------------------------------ Банк вопросов ---------------------------- */

export async function fetchCategories(): Promise<QuestionCategory[]> {
  const { data } = await apiSurveysClient.get('question-categories');
  const payload = (data ?? {}) as Record<string, unknown>;
  const items = Array.isArray(payload.items)
    ? payload.items
    : Array.isArray(data)
      ? data
      : [];
  return items.map((raw) => {
    const c = raw as Record<string, unknown>;
    return { id: toId(c.id), name: String(c.name ?? '') };
  });
}

export async function createCategory(name: string): Promise<QuestionCategory> {
  const { data } = await apiSurveysClient.post('question-categories', {
    name,
  });
  const c = data as Record<string, unknown>;
  return { id: toId(c.id), name: String(c.name ?? name) };
}

export async function updateCategory(
  id: string,
  name: string
): Promise<QuestionCategory> {
  const { data } = await apiSurveysClient.patch(`question-categories/${id}`, {
    name,
  });
  const c = data as Record<string, unknown>;
  return { id: toId(c.id), name: String(c.name ?? name) };
}

export async function deleteCategory(id: string): Promise<void> {
  await apiSurveysClient.delete(`question-categories/${id}`);
}

export async function fetchBankQuestions(params?: {
  category_id?: string;
  q?: string;
  type?: string;
  skip?: number;
  limit?: number;
}): Promise<{ items: BankQuestion[]; total: number }> {
  const { data } = await apiSurveysClient.get('question-bank', {
    params: {
      skip: params?.skip ?? 0,
      limit: params?.limit ?? 200,
      ...(params?.category_id ? { category_id: params.category_id } : {}),
      ...(params?.q?.trim() ? { q: params.q.trim() } : {}),
      ...(params?.type ? { type: params.type } : {}),
    },
  });
  const payload = (data ?? {}) as Record<string, unknown>;
  const items = Array.isArray(payload.items)
    ? payload.items
    : Array.isArray(data)
      ? data
      : [];
  return {
    items: items.map(normalizeBankQuestion),
    total: Number(payload.total ?? items.length),
  };
}

export async function createBankQuestion(
  payload: BankQuestionPayload
): Promise<BankQuestion> {
  const { data } = await apiSurveysClient.post('question-bank', payload);
  return normalizeBankQuestion(data);
}

export async function updateBankQuestion(
  id: string,
  payload: BankQuestionPayload
): Promise<BankQuestion> {
  const { data } = await apiSurveysClient.patch(`question-bank/${id}`, payload);
  return normalizeBankQuestion(data);
}

export async function deleteBankQuestion(id: string): Promise<void> {
  await apiSurveysClient.delete(`question-bank/${id}`);
}

/* ---------------------------- Users-service ---------------------------- */

/** GET /organizations/select?unit_type=DEPARTMENT (users-service) */
export async function fetchDepartments(): Promise<DepartmentOption[]> {
  const { data } = await apiUserClient.get('organizations/select', {
    params: { unit_type: 'DEPARTMENT' },
  });
  if (!Array.isArray(data)) return [];
  return data
    .map((raw) => {
      const d = raw as Record<string, unknown>;
      return {
        id: toId(d.id),
        label: String(d.label ?? d.name ?? d.title ?? ''),
        abbreviation: (d.abbreviation as string | null) ?? null,
      };
    })
    .filter((d) => d.id);
}

/** GET /organizations/{department_id}/employees/select?active=true */
export async function fetchDepartmentEmployees(
  departmentId: string
): Promise<EmployeeOption[]> {
  const { data } = await apiUserClient.get(
    `organizations/${departmentId}/employees/select`,
    { params: { active: true } }
  );
  if (!Array.isArray(data)) return [];
  return data
    .map((raw) => {
      const e = raw as Record<string, unknown>;
      return {
        id: toId(e.id),
        label: String(e.label ?? e.full_name ?? e.name ?? ''),
        position: (e.position as string | null) ?? null,
      };
    })
    .filter((e) => e.id);
}
