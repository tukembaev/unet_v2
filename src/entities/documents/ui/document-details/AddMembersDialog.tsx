import { X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { AsyncSelect } from 'shared/components/select/AsyncSelect';
import { UserListItem } from 'entities/user/model/types';
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from 'shared/ui';
import { Field, FieldLabel } from 'shared/ui/field';
import { useTypeApprovals } from 'entities/documents/model/queries';
import { AddMemberPayload } from 'features/create-document/model/types';

interface AddMembersDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddMembers: (members: AddMemberPayload[]) => void;
  isSubmitting?: boolean;
}

interface MemberWithName extends AddMemberPayload {
  user_name?: string;
}

export function AddMembersDialog({
  open,
  onOpenChange,
  onAddMembers,
  isSubmitting = false,
}: AddMembersDialogProps) {
  const { data: typeApprovals = [], isLoading: isLoadingTypeApprovals } = useTypeApprovals();
  
  const [selectedMemberUser, setSelectedMemberUser] = useState<UserListItem | null>(null);
  const [selectedTypeApproval, setSelectedTypeApproval] = useState<string>('');
  const [members, setMembers] = useState<MemberWithName[]>([]);

  // Автоматически добавляем участника при выборе типа согласования
  useEffect(() => {
    if (selectedMemberUser && selectedTypeApproval) {
      const member: MemberWithName = {
        user_id: selectedMemberUser.user_id,
        type_approval_id: selectedTypeApproval,
        user_name: selectedMemberUser.full_name,
      };
      
      setMembers(prev => [...prev, member]);
      
      // Очищаем выбор
      setSelectedMemberUser(null);
      setSelectedTypeApproval('');
    }
  }, [selectedMemberUser, selectedTypeApproval]);

  const handleRemoveMember = (index: number) => {
    setMembers(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (members.length > 0) {
      // Убираем user_name перед отправкой
      const membersForApi = members.map(({ user_id, type_approval_id }) => ({
        user_id,
        type_approval_id,
      }));
      onAddMembers(membersForApi);
    }
  };

  const handleCancel = () => {
    setMembers([]);
    setSelectedMemberUser(null);
    setSelectedTypeApproval('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Добавить согласующих</DialogTitle>
          <DialogDescription>
            Выберите пользователей и типы согласования для добавления в цепочку
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Field>
            <FieldLabel>
              Участники согласования
              {members.length > 0 && (
                <span className="ml-2 text-xs text-muted-foreground">
                  ({members.length} участник{members.length > 1 ? 'ов' : ''})
                </span>
              )}
            </FieldLabel>
            <div className="space-y-3">
              {/* Список добавленных участников */}
              {members.length > 0 && (
                <div className="space-y-2">
                  {members.map((member, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border border-border rounded-md bg-card"
                    >
                      <div className="text-sm">
                        <span className="font-medium">
                          {member.user_name || `User ID: ${member.user_id}`}
                        </span>
                        <span className="text-muted-foreground ml-2">
                          - {typeApprovals.find(t => t.id === member.type_approval_id)?.title || 'Тип согласования'}
                        </span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveMember(index)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {/* Форма добавления нового участника */}
              <div className="flex gap-2">
                <div className="flex-1">
                  <AsyncSelect
                    value={selectedMemberUser}
                    onChange={setSelectedMemberUser}
                    placeholder="Выберите пользователя"
                  />
                </div>
                <div className="flex-1">
                  <Select
                    value={selectedTypeApproval}
                    onValueChange={setSelectedTypeApproval}
                    disabled={isLoadingTypeApprovals}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={isLoadingTypeApprovals ? "Загрузка..." : "Тип согласования"} />
                    </SelectTrigger>
                    <SelectContent>
                      {typeApprovals.map((type) => (
                        <SelectItem key={type.id} value={type.id}>
                          {type.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </Field>
        </div>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={handleCancel} disabled={isSubmitting} type="button">
            Отмена
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitting || members.length === 0}
          >
            {isSubmitting ? 'Добавление...' : `Добавить (${members.length})`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
