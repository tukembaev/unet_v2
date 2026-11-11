import { ArrowLeft, ExternalLink } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { ROUTES } from 'app/providers/routes';
import PdfViewer from 'shared/components/pdf-viewer/PdfViewer';
import { Button, Skeleton } from 'shared/ui';
import { PageHeader } from 'widgets/page-header';
import { useUdocLink } from '../model/queries';

function isPdfUrl(url: string): boolean {
  const clean = url.split('?')[0]?.toLowerCase() ?? '';
  return clean.endsWith('.pdf');
}

export function UdocDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, isLoading, isError } = useUdocLink(id);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Приказ UDOC"
        description="Документ для ознакомления сотрудников"
      >
        <Button
          type="button"
          variant="outline"
          className="rounded-xl"
          onClick={() => navigate(ROUTES.UDOC)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          К списку
        </Button>
      </PageHeader>

      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-10 w-48 rounded-xl" />
          <Skeleton className="h-[480px] w-full rounded-2xl" />
        </div>
      ) : isError || !data?.link ? (
        <div className="rounded-2xl border border-dashed py-16 text-center text-sm text-muted-foreground">
          Не удалось загрузить документ
        </div>
      ) : (
        <div className="space-y-4">
          {isPdfUrl(data.link) ? (
            <PdfViewer url={data.link} status="" />
          ) : (
            <div className="space-y-3">
              <div className="flex justify-end">
                <Button asChild variant="outline" size="sm" className="rounded-xl">
                  <a href={data.link} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Открыть в новой вкладке
                  </a>
                </Button>
              </div>
              <iframe
                title="UDOC документ"
                src={data.link}
                className="h-[70vh] w-full rounded-2xl border bg-background"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
