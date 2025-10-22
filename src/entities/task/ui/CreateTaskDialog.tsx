import { CreateTaskDialog } from 'features/create-task';

interface CreateTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateTaskDialogWrapper({ open, onOpenChange }: CreateTaskDialogProps) {
  return <CreateTaskDialog open={open} onOpenChange={onOpenChange} />;
}