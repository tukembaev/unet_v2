import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "shared/ui";
import {
  FormQuery,
  useFormClose,
  useIsFormOpen,
} from "shared/lib";
import type { SyllabusSemester } from "entities/education-management/model/types";
import { addProfiles } from "entities/education-management/model/api";
import { useProfilesInDirections } from "entities/education-management/model/queries";
import { useQueryClient } from "@tanstack/react-query";
import { curriculumKeys } from "entities/curriculum/model/queries";

type Props = {
  semesters: SyllabusSemester[];
  directionId?: number;
};

export const ManageProfilesDialog = ({ semesters, directionId }: Props) => {
  const open = useIsFormOpen(FormQuery.MANAGE_PROFILES);
  const closeForm = useFormClose();
  const queryClient = useQueryClient();
  const [selectedBySemester, setSelectedBySemester] = useState<Record<number, number | null>>({});
  const [savingSemesterId, setSavingSemesterId] = useState<number | null>(null);
  const [removingKey, setRemovingKey] = useState<string | null>(null);
  const { data: profilesOptionsData = [] } = useProfilesInDirections(directionId);

  const semestersSorted = useMemo(
    () =>
      [...(semesters ?? [])].sort(
        (a, b) => Number(a?.name_semester) - Number(b?.name_semester)
      ),
    [semesters]
  );

  const profileOptions = useMemo(() => {
    if (profilesOptionsData.length > 0) return profilesOptionsData;
    const map = new Map<number, string>();
    semestersSorted.forEach((semester) => {
      (semester.profiles_name ?? []).forEach((profile) => {
        if (typeof profile?.id === "number" && profile?.title) {
          map.set(profile.id, profile.title);
        }
      });
    });
    return [...map.entries()].map(([value, label]) => ({ value, label }));
  }, [profilesOptionsData, semestersSorted]);

  const refresh = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: curriculumKeys.courses() }),
      queryClient.invalidateQueries({ queryKey: ["syllabus-report"] }),
    ]);
  };

  return (
    <Dialog open={open} onOpenChange={() => closeForm(FormQuery.MANAGE_PROFILES)}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Профили по семестрам</DialogTitle>
          <DialogDescription>
            Добавляйте и удаляйте профили в каждом семестре
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {semestersSorted.map((semester) => {
            const existingProfiles = semester.profiles_name ?? [];
            const selectedValue = selectedBySemester[semester.id] ?? null;

            return (
              <div key={semester.id} className="rounded-md border p-3 space-y-3">
                <div className="font-medium">{semester.name_semester} семестр</div>

                <div className="flex flex-wrap gap-2">
                  {existingProfiles.length > 0 ? (
                    existingProfiles.map((p) => {
                      const key = `${semester.id}:${p.id}`;
                      return (
                        <span
                          key={key}
                          className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-1 text-xs"
                        >
                          {p.title}
                          <button
                            type="button"
                            className="text-muted-foreground hover:text-foreground"
                            disabled={removingKey === key}
                            onClick={async () => {
                              setRemovingKey(key);
                              try {
                                await addProfiles(semester.id, { profile_to_remove: p.id });
                                await refresh();
                                toast.success("Профиль удален");
                              } catch (e) {
                                toast.error(
                                  e instanceof Error ? e.message : "Не удалось удалить профиль"
                                );
                              } finally {
                                setRemovingKey(null);
                              }
                            }}
                          >
                            ×
                          </button>
                        </span>
                      );
                    })
                  ) : (
                    <span className="text-sm text-muted-foreground">Профили не добавлены</span>
                  )}
                </div>

                <div className="flex gap-2">
                  <Select
                    value={selectedValue != null ? String(selectedValue) : undefined}
                    disabled={profileOptions.length === 0}
                    onValueChange={(value) =>
                      setSelectedBySemester((prev) => ({
                        ...prev,
                        [semester.id]: Number(value),
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите профиль" />
                    </SelectTrigger>
                    <SelectContent>
                      {profileOptions.map((option) => (
                        <SelectItem key={option.value} value={String(option.value)}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    type="button"
                    disabled={!selectedValue || savingSemesterId === semester.id}
                    onClick={async () => {
                      if (!selectedValue) return;
                      const exists = existingProfiles.some((p) => p.id === selectedValue);
                      if (exists) {
                        toast.warning("Этот профиль уже добавлен в семестр");
                        return;
                      }

                      setSavingSemesterId(semester.id);
                      try {
                        await addProfiles(semester.id, { profiles: [selectedValue] });
                        await refresh();
                        toast.success("Профиль добавлен");
                      } catch (e) {
                        toast.error(
                          e instanceof Error ? e.message : "Не удалось добавить профиль"
                        );
                      } finally {
                        setSavingSemesterId(null);
                      }
                    }}
                  >
                    Добавить
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ManageProfilesDialog;

