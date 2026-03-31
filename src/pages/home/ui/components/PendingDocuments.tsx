import { Card, CardContent, Badge, Skeleton } from 'shared/ui';
import { FileText, Clock, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { usePendingDocuments } from '../../model/hooks/usePendingDocuments';

export const PendingDocuments = () => {
  const navigate = useNavigate();
  const { documents, isLoading } = usePendingDocuments();

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <Skeleton className="h-16 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!documents || documents.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <FileText className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">
            Нет документов на согласовании
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {documents.slice(0, 5).map((doc) => (
        <Card
          key={doc.id}
          className="hover:shadow-md transition-all duration-200 cursor-pointer"
          onClick={() => navigate(`/documents/applications/${doc.id}`)}
        >
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <div className="p-2 rounded-lg bg-yellow-500/10 shrink-0">
                  <FileText className="h-5 w-5 text-yellow-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm truncate">
                    {doc.title || 'Без названия'}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    От: {doc.sender_full_name}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline" className="gap-1.5">
                      <Clock className="h-3 w-3" />
                      {doc.status || 'На рассмотрении'}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {new Date(doc.created_at).toLocaleDateString('ru-RU')}
                    </span>
                  </div>
                </div>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground shrink-0" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
