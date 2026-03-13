import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  Button,
  Label,
} from "shared/ui";
import { AsyncMultiSelect } from "shared/components/select/AsyncMultiSelect";
import { UserListItem } from "entities/user/model/types";
import { useAddTaskMembers } from "../model/queries";
import { useFormClose, useIsFormOpen, FormQuery, useStoredFormParam } from "shared/lib";
import { syncUsers } from "entities/user/model/api";

export const AddTaskMembersDialog = () => {
  const isOpen = useIsFormOpen(FormQuery.ADD_TASK_MEMBERS);
  const closeForm = useFormClose();
  const taskId = useStoredFormParam(FormQuery.ADD_TASK_MEMBERS, "task_id");
  
  const [coExecutors, setCoExecutors] = useState<UserListItem[]>([]);
  const [observers, setObservers] = useState<UserListItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addMembersMutation = useAddTaskMembers();

  const handleClose = () => {
    setCoExecutors([]);
    setObservers([]);
    closeForm();
  };

  const handleSubmit = async () => {
    if (!taskId) return;

    setIsSubmitting(true);
    try {
      // Sync users first
      const allUsers = [...coExecutors, ...observers];
      if (allUsers.length > 0) {
        await syncUsers(allUsers);
      }

      // Prepare data
      const coExecutorIds = coExecutors.map((user) => user.user_id);
      const observerIds = observers.map((user) => user.user_id);

      // Submit
      await addMembersMutation.mutateAsync({
        taskId,
        data: {
          coExecutors: coExecutorIds,
          observers: observerIds,
        },
      });

      handleClose();
    } catch (error) {
      console.error("Failed to add task members:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Добавить участников</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Соисполнители</Label>
            <AsyncMultiSelect
              value={coExecutors}
              onChange={setCoExecutors}
              placeholder="Выбрать соисполнителей"
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label>Наблюдатели</Label>
            <AsyncMultiSelect
              value={observers}
              onChange={setObservers}
              placeholder="Выбрать наблюдателей"
              disabled={isSubmitting}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isSubmitting}>
            Отмена
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Добавление..." : "Добавить"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
