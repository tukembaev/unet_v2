/** Ключи React Query для модуля учебного плана (РУП) */
export const curriculumKeys = {
  root: ['curriculum'] as const,
  lists: () => [...curriculumKeys.root, 'list'] as const,
  list: () => [...curriculumKeys.lists()] as const,
  courses: () => [...curriculumKeys.root, 'course'] as const,
  course: (syllabusId: number | undefined, profileId?: number) =>
    [...curriculumKeys.courses(), syllabusId, profileId ?? 'base'] as const,
  directionOptions: () =>
    [...curriculumKeys.root, 'select-directions'] as const,
  templatesByDirection: (directionId: number | undefined) =>
    [...curriculumKeys.root, 'discipline-templates', directionId ?? 'none'] as const,
};
