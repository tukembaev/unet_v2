export type {
  DepartmentDisciplineRow,
  DepartmentDisciplinePayload,
  SelectOptions,
} from './model/types';
export {
  getKafDiscipline,
  getAllDisciplineForPrerequisite,
  getSelectorDirections,
  postKafDiscipline,
  patchKafDiscipline,
  deleteDepartmentDiscipline,
} from './model/api';
export {
  departmentDisciplineKeys,
  useDepartmentDisciplines,
  usePrerequisiteOptions,
  useDirectionOptions,
  useCreateDepartmentDiscipline,
  useUpdateDepartmentDiscipline,
  useDeleteDepartmentDiscipline,
} from './model/queries';
export { DepartmentDisciplinesContent } from './ui/DepartmentDisciplinesContent';
export { DepartmentDisciplinesTableSkeleton } from './ui/DepartmentDisciplinesTableSkeleton';
export { DepartmentDisciplineDialog } from './ui/DepartmentDisciplineDialog';
