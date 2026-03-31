import { Card, CardContent, Skeleton, Button } from 'shared/ui';
import { FileText, ArrowRight, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { usePendingDocuments } from '../../model/hooks/usePendingDocuments';
import { useFormNavigation, FormQuery } from 'shared/lib';

export const DocumentsOverview = () => {
  const navigate = useNavigate();
  const openForm = useFormNavigation();
  const { documents, isLoading } = usePendingDocuments();

  if (isLoading) {
    return (
      <Card className="border-0 shadow-sm">
        <CardContent className="p-4">
          <div className="space-y-3">
            <Skeleton className="h-6 w-32" />
            {[1, 2].map((i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
            <h2 className="text-sm font-semibold">На согласовании</h2>
            <span className="text-xs text-muted-foreground">
              {documents.length}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => openForm(FormQuery.CREATE_DOCUMENT)}
            >
              <Plus className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/documents/applications')}
              className="h-7 px-2 text-xs"
            >
              Все
              <ArrowRight className="h-3 w-3 ml-1" />
            </Button>
          </div>
        </div>

        {/* Documents List */}
        {documents.length === 0 ? (
          <div className="py-8 text-center">
            <FileText className="h-8 w-8 text-muted-foreground mx-auto mb-2 opacity-50" />
            <p className="text-xs text-muted-foreground">
              Нет документов
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {documents.slice(0, 3).map((doc) => (
              <div
                key={doc.id}
                onClick={() => navigate(`/documents/applications/${doc.id}`)}
                className="group p-3 rounded-lg border bg-card hover:bg-accent/50 transition-all cursor-pointer"
              >
                <div className="flex items-start gap-2">
                  <FileText className="h-4 w-4 mt-0.5 text-yellow-600 dark:text-yellow-400 shrink-0" />
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-xs leading-tight group-hover:text-primary transition-colors mb-1">
                      {doc.title || 'Без названия'}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{doc.sender_full_name}</span>
                      <span>•</span>
                      <span>
                        {new Date(doc.created_at).toLocaleDateString('ru-RU', {
                          day: 'numeric',
                          month: 'short',
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
