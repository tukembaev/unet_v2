import { useState } from 'react';
import { toast } from 'sonner';
import { FileUp } from 'lucide-react';
import { AsyncMultiSelect } from 'shared/components/select';
import type { UserListItem } from 'entities/user/model/types';
import { FormQuery, getHttpErrorMessage, useFormClose, useIsFormOpen } from 'shared/lib';
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  FileDragDrop,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from 'shared/ui';
import { Field, FieldGroup, FieldLabel } from 'shared/ui/field';
import { OrganizationMultiSelect } from 'entities/udoc/ui/OrganizationMultiSelect';
import { useGrantUdocAccess } from 'entities/udoc/model/queries';
import type {
  OrganizationUnit,
  UdocAccessScope,
} from 'entities/udoc/model/types';

export function ShareUdocDialog() {
  const open = useIsFormOpen(FormQuery.SHARE_UDOC);
  const closeForm = useFormClose();
  const grant = useGrantUdocAccess();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [users, setUsers] = useState<UserListItem[]>([]);
  const [orgs, setOrgs] = useState<OrganizationUnit[]>([]);
  const [accessScope, setAccessScope] = useState<UdocAccessScope | 'none'>(
    'employee'
  );

  const reset = () => {
    setTitle('');
    setDescription('');
    setFiles([]);
    setUsers([]);
    setOrgs([]);
    setAccessScope('employee');
  };

  const handleClose = () => {
    if (grant.isPending) return;
    reset();
    closeForm(FormQuery.SHARE_UDOC);
  };

  const handleSubmit = async () => {
    const file = files[0];
    if (!file) {
      toast.error('Загрузите файл приказа');
      return;
    }
    if (!users.length && !orgs.length) {
      toast.error('Выберите сотрудников или подразделения');
      return;
    }

    try {
      await grant.mutateAsync({
        file,
        title: title.trim() || undefined,
        description: description.trim() || undefined,
        user_ids: users.map((u) => u.user_id),
        department_ids: orgs.map((o) => o.id),
        access_scope:
          accessScope === 'none' ? undefined : accessScope,
      });
      toast.success('Приказ отправлен');
      reset();
      closeForm(FormQuery.SHARE_UDOC);
    } catch (e) {
      toast.error('Не удалось отправить приказ', {
        description: getHttpErrorMessage(e),
      });
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) handleClose();
      }}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto rounded-2xl sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-lg">Загрузить приказ</DialogTitle>
          <DialogDescription>
            Рассылка приказа сотрудникам и подразделениям
          </DialogDescription>
        </DialogHeader>

        <FieldGroup className="gap-4">
          <Field>
            <FieldLabel>Тема</FieldLabel>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Название приказа"
              className="rounded-xl"
            />
          </Field>

          <Field>
            <FieldLabel>Описание</FieldLabel>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Кратко, кого касается приказ"
              className="min-h-[80px] rounded-xl"
            />
          </Field>

          <Field>
            <FieldLabel>
              Файл<span className="ml-1 text-destructive">*</span>
            </FieldLabel>
            <FileDragDrop
              files={files}
              onFilesChange={setFiles}
              maxFiles={1}
              multiple={false}
              accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg"
              title="Перетащите приказ сюда"
              description="PDF, Word, Excel или изображение"
            />
          </Field>

          <Field>
            <FieldLabel>Сотрудники</FieldLabel>
            <AsyncMultiSelect
              value={users}
              onChange={setUsers}
              placeholder="Выберите сотрудников"
            />
          </Field>

          <Field>
            <FieldLabel>Подразделения</FieldLabel>
            <OrganizationMultiSelect value={orgs} onChange={setOrgs} />
          </Field>

          <Field>
            <FieldLabel>Область доступа</FieldLabel>
            <Select
              value={accessScope}
              onValueChange={(v) =>
                setAccessScope(v as UdocAccessScope | 'none')
              }
            >
              <SelectTrigger className="rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="employee">Сотрудники</SelectItem>
                <SelectItem value="student">Студенты</SelectItem>
                <SelectItem value="public">Публичный</SelectItem>
                <SelectItem value="none">Не указывать</SelectItem>
              </SelectContent>
            </Select>
          </Field>
        </FieldGroup>

        <DialogFooter className="mt-2 gap-2">
          <Button
            type="button"
            variant="outline"
            className="rounded-xl"
            onClick={handleClose}
            disabled={grant.isPending}
          >
            Отмена
          </Button>
          <Button
            type="button"
            className="rounded-xl"
            onClick={() => void handleSubmit()}
            disabled={grant.isPending}
          >
            <FileUp className="mr-2 h-4 w-4" />
            {grant.isPending ? 'Отправка…' : 'Отправить'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
