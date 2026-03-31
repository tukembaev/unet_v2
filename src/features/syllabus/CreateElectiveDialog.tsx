import { FormQuery } from "shared/lib";
import { CreateCourseDialog } from "./CreateCourseDialog";

export const CreateElectiveDialog = () => (
  <CreateCourseDialog
    formType={FormQuery.CREATE_ELECTIVE}
    fixedCourseType="Курс по выбору"
    dialogTitle="Добавить предмет по выбору"
    dialogDescription="Создайте новый предмет по выбору и привяжите к группе"
  />
);

export default CreateElectiveDialog;
