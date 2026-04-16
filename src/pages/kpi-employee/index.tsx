import { useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, CalendarDays, ExternalLink, FileText, Paperclip, ShieldCheck, UserRound } from "lucide-react";

import type { KpiEmployeePublicationResponse } from "entities/kpi-report/model/api";
import { usePatchKpiInfoStatus, useKpiEmployeePublications } from "entities/kpi-report/model/queries";
import { getHttpErrorMessage } from "shared/lib/http-error";
import { Badge, Button, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, Textarea } from "shared/ui";
import { cn } from "shared/lib/utils";
import { ROUTES } from "app/providers/routes";
import { toast } from "sonner";

function statusBadgeClass(status?: string) {
  const s = (status || "").toLowerCase();
  if (s.includes("подтверж")) return "bg-emerald-500/10 text-emerald-700 border-emerald-500/20";
  if (s.includes("отказ")) return "bg-rose-500/10 text-rose-700 border-rose-500/20";
  if (s.includes("рассмотр") || s.includes("ожид")) return "bg-amber-500/10 text-amber-700 border-amber-500/20";
  return "bg-muted text-muted-foreground border-border";
}

function normalizedStatus(status?: string) {
  const s = (status || "").toLowerCase();
  if (s.includes("подтверж")) return "confirmed";
  if (s.includes("отказ")) return "rejected";
  return "waiting";
}

const EMPTY_PUBLICATIONS: KpiEmployeePublicationResponse = [];

export const KpiEmployeePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userId } = useParams<{ userId: string }>();
  const numericUserId = Number(userId);
  const validUserId = Number.isFinite(numericUserId) && numericUserId > 0 ? numericUserId : null;
  const { data: publicationsData, isLoading, error } = useKpiEmployeePublications(validUserId);
  const publications = publicationsData ?? EMPTY_PUBLICATIONS;
  const patchStatus = usePatchKpiInfoStatus(validUserId);
  const backContext = (location.state as { kpiBackContext?: Record<string, unknown> } | null)
    ?.kpiBackContext as
    | {
        tab?: string;
        instituteId?: number;
        departmentId?: number;
        departmentName?: string;
      }
    | undefined;

  const publicationCount = useMemo(
    () =>
      publications.reduce((acc, block) => {
        const cats = Array.isArray(block.category) ? block.category : [];
        return acc + cats.reduce((sum, cat) => sum + (Array.isArray(cat.kpi) ? cat.kpi.length : 0), 0);
      }, 0),
    [publications]
  );

  const [rejectState, setRejectState] = useState<{ open: boolean; kpiId: number; reason: string }>({
    open: false,
    kpiId: 0,
    reason: "",
  });

  const openRejectModal = (kpiId: number, initialReason?: string | null) => {
    setRejectState({
      open: true,
      kpiId,
      reason: (initialReason || "").trim(),
    });
  };

  const closeRejectModal = () => {
    setRejectState({ open: false, kpiId: 0, reason: "" });
  };

  const submitReject = async () => {
    const reason = rejectState.reason.trim();
    if (!reason) {
      toast.error("Укажите причину отказа");
      return;
    }
    try {
      await patchStatus.mutateAsync({
        kpiId: rejectState.kpiId,
        payload: {
          status: "Отказано",
          rejection_reason: reason,
        },
      });
      toast.success("Статус обновлен: Отказано");
      closeRejectModal();
    } catch (e) {
      toast.error("Не удалось обновить статус", {
        description: getHttpErrorMessage(e),
      });
    }
  };

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-border/70 bg-gradient-to-b from-muted/40 to-background p-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <UserRound className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold">Публикации сотрудника</h2>
              <p className="text-xs text-muted-foreground">Личный KPI-профиль публикаций</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="rounded-full px-3 py-1 text-xs">
              Всего публикаций: {publicationCount}
            </Badge>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mt-4 gap-2"
          onClick={() => {
            navigate(ROUTES.KPI_REPORTS, {
              state: backContext ? { kpiRestoreContext: backContext } : undefined,
            });
          }}
        >
          <ArrowLeft className="h-4 w-4" />
          Назад
        </Button>
      </div>

      {error ? (
        <p className="text-sm text-destructive">
          {getHttpErrorMessage(error, "Не удалось загрузить публикации сотрудника.")}
        </p>
      ) : null}

      {isLoading ? (
        <div className="space-y-4 rounded-2xl border border-border/70 bg-card p-4 shadow-sm">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-3 rounded-xl border border-border/60 bg-muted/20 p-3">
              <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
              <div className="h-3 w-1/3 animate-pulse rounded bg-muted" />
              <div className="space-y-2">
                <div className="h-3 w-full animate-pulse rounded bg-muted" />
                <div className="h-3 w-[92%] animate-pulse rounded bg-muted" />
                <div className="h-3 w-[78%] animate-pulse rounded bg-muted" />
              </div>
            </div>
          ))}
        </div>
      ) : publicationCount === 0 ? (
        <div className="rounded-xl border border-dashed border-border/70 bg-muted/10 px-6 py-12 text-center text-sm text-muted-foreground">
          Нет публикаций по KPI.
        </div>
      ) : (
        <div className="space-y-4">
          {publications.map((block) => (
            <section key={block.id} className="space-y-3 rounded-2xl border border-border/70 bg-card p-4 shadow-sm">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <FileText className="h-4 w-4" />
                </div>
                <h3 className="text-sm font-semibold">{block.title}</h3>
              </div>

              {(block.category ?? []).map((cat) => (
                <div key={cat.id} className="space-y-3 rounded-xl border border-border/60 bg-muted/20 p-3">
                  <p className="text-sm font-medium leading-snug">{cat.title}</p>
                  {(cat.kpi ?? []).map((kpi) => (
                    <article key={kpi.id} className="rounded-xl border border-border/70 bg-background p-3 shadow-sm">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <p className="text-sm font-semibold leading-snug">{kpi.title || "Без названия"}</p>
                        <Badge className={cn("border text-xs", statusBadgeClass(kpi.status))}>
                          {kpi.status || "Без статуса"}
                        </Badge>
                      </div>

                      <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                        {kpi.published ? (
                          <span className="inline-flex items-center gap-1">
                            <CalendarDays className="h-3.5 w-3.5" />
                            Опубликовано: {kpi.published}
                          </span>
                        ) : null}
                        <span className="inline-flex items-center gap-1">
                          <ShieldCheck className="h-3.5 w-3.5" />
                          Подписывает комиссия
                        </span>
                      </div>

                      {kpi.description ? (
                        <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                          {kpi.description}
                        </p>
                      ) : null}

                      {kpi.rejection_reason ? (
                        <div className="mt-2 rounded-lg border border-rose-300/60 bg-rose-500/5 px-3 py-2">
                          <p className="text-xs font-medium text-rose-700 dark:text-rose-300">
                            Причина отказа: {kpi.rejection_reason}
                          </p>
                        </div>
                      ) : null}

                      {Array.isArray(kpi.kpi_authors) && kpi.kpi_authors.length > 0 ? (
                        <p className="mt-2 text-xs text-muted-foreground">
                          Авторы:{" "}
                          {kpi.kpi_authors
                            .map((a) => a.employee_name)
                            .filter(Boolean)
                            .join(", ")}
                        </p>
                      ) : null}
                      {Array.isArray(kpi.files) && kpi.files.length > 0 ? (
                        <div className="mt-3 space-y-1.5">
                          <p className="text-xs font-medium text-foreground">Закрепленные файлы</p>
                          <div className="flex flex-wrap gap-2">
                            {kpi.files.map((f, fileIdx) => (
                              <a
                                key={f.id}
                                className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-muted/30 px-2.5 py-1 text-xs font-medium text-foreground hover:bg-muted"
                                href={f.file}
                                target="_blank"
                                rel="noreferrer"
                              >
                                <Paperclip className="h-3.5 w-3.5" />
                                Файл {fileIdx + 1}
                              </a>
                            ))}
                          </div>
                        </div>
                      ) : null}
                      {kpi.link ? (
                        <a
                          className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-primary underline-offset-2 hover:underline"
                          href={kpi.link}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                          Ссылка на публикацию
                        </a>
                      ) : null}

                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        {normalizedStatus(kpi.status) === "waiting" ? (
                          <>
                            <Button
                              type="button"
                              size="sm"
                              className="h-8"
                              disabled={patchStatus.isPending}
                              onClick={async () => {
                                try {
                                  await patchStatus.mutateAsync({
                                    kpiId: kpi.id,
                                    payload: { status: "Подтверждено" },
                                  });
                                  toast.success("Статус обновлен: Подтверждено");
                                } catch (e) {
                                  toast.error("Не удалось обновить статус", {
                                    description: getHttpErrorMessage(e),
                                  });
                                }
                              }}
                            >
                              Подтвердить
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              variant="destructive"
                              className="h-8"
                              disabled={patchStatus.isPending}
                              onClick={() => openRejectModal(kpi.id, kpi.rejection_reason)}
                            >
                              Отказать
                            </Button>
                          </>
                        ) : normalizedStatus(kpi.status) === "confirmed" ? (
                          <Button
                            type="button"
                            size="sm"
                            variant="destructive"
                            className="h-8"
                            disabled={patchStatus.isPending}
                            onClick={() => openRejectModal(kpi.id, kpi.rejection_reason)}
                          >
                            Отказать
                          </Button>
                        ) : (
                          <Button
                            type="button"
                            size="sm"
                            className="h-8"
                            disabled={patchStatus.isPending}
                            onClick={async () => {
                              try {
                                await patchStatus.mutateAsync({
                                  kpiId: kpi.id,
                                  payload: { status: "Подтверждено" },
                                });
                                toast.success("Статус обновлен: Подтверждено");
                              } catch (e) {
                                toast.error("Не удалось обновить статус", {
                                  description: getHttpErrorMessage(e),
                                });
                              }
                            }}
                          >
                            Подтвердить
                          </Button>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              ))}
            </section>
          ))}
        </div>
      )}

      <Dialog open={rejectState.open} onOpenChange={(open) => !open && closeRejectModal()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Причина отказа</DialogTitle>
            <DialogDescription>
              Укажите комментарий комиссии для статуса «Отказано».
            </DialogDescription>
          </DialogHeader>
          <Textarea
            value={rejectState.reason}
            onChange={(e) => setRejectState((s) => ({ ...s, reason: e.target.value }))}
            placeholder="Введите причину отказа"
            className="min-h-24"
          />
          <DialogFooter>
            <Button type="button" variant="outline" onClick={closeRejectModal} disabled={patchStatus.isPending}>
              Отмена
            </Button>
            <Button type="button" variant="destructive" onClick={() => void submitReject()} disabled={patchStatus.isPending}>
              Подтвердить отказ
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

