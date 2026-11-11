import { useSyllabusStudents } from '../model';
import { getHttpErrorMessage } from 'shared/lib/http-error';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from 'shared/ui';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  syllabusId: number | null;
  syllabusTitle: string;
};

export function SyllabusStudentsDialog({
  open,
  onOpenChange,
  syllabusId,
  syllabusTitle,
}: Props) {
  const studentsQuery = useSyllabusStudents(open ? syllabusId : null);
  const students = studentsQuery.data?.results ?? [];
  const count = studentsQuery.data?.count ?? students.length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-hidden rounded-2xl sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Студенты РУП</DialogTitle>
          <DialogDescription>
            {syllabusTitle || 'Учебный план'}
            {count > 0 ? ` · ${count}` : ''}
          </DialogDescription>
        </DialogHeader>

        {studentsQuery.isLoading ? (
          <div className="space-y-2 py-2">
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton key={index} className="h-10 w-full rounded-xl" />
            ))}
          </div>
        ) : studentsQuery.isError ? (
          <p className="py-8 text-center text-sm text-destructive">
            {getHttpErrorMessage(
              studentsQuery.error,
              'Не удалось загрузить студентов'
            )}
          </p>
        ) : students.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            К этому РУП пока не прикреплены студенты
          </p>
        ) : (
          <div className="max-h-[55vh] overflow-y-auto rounded-xl border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40">
                  <TableHead className="w-12 text-center">№</TableHead>
                  <TableHead>ФИО</TableHead>
                  <TableHead className="w-36">Тип</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((student, index) => (
                  <TableRow key={student.id}>
                    <TableCell className="text-center text-muted-foreground">
                      {index + 1}
                    </TableCell>
                    <TableCell className="font-medium">
                      {student.full_name}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {student.student_type || '—'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
