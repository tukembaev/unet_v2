import { Card, CardContent, Badge } from "shared/ui";
import { FileText, Calendar, Hash, User, Clock, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { motion } from "motion/react";
import { useParams } from "react-router-dom";
import { useDocumentDetails } from "entities/documents/model/queries";

const statusConfig: Record<string, { icon: React.ReactNode; className: string }> = {
  'В режиме ожидания': {
    icon: <Clock className="h-3 w-3" />,
    className: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  },
  'В процессе выполнения': {
    icon: <Loader2 className="h-3 w-3 animate-spin" />,
    className: 'bg-blue-100 text-blue-800 border-blue-300',
  },
  'Завершено': {
    icon: <CheckCircle2 className="h-3 w-3" />,
    className: 'bg-green-100 text-green-800 border-green-300',
  },
  'Доработать': {
    icon: <XCircle className="h-3 w-3" />,
    className: 'bg-red-100 text-red-800 border-red-300',
  },
};

const DocFileCard = () => {
  const { id } = useParams<{ id: string }>();
  const { data: document } = useDocumentDetails(id || '');

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Intl.DateTimeFormat('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(dateString)).replace(',', ' года в');
  };

  if (!document) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="hover:shadow-md transition-all duration-200">
        <CardContent className="p-4">
          {/* Header with Status */}
          <div className="flex items-center justify-between mb-3 pb-3 border-b">
            <h3 className="text-base font-semibold flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              Карточка документа
            </h3>
            {document.status && (
              <Badge 
                variant="outline" 
                className={`gap-1.5 whitespace-nowrap ${statusConfig[document.status]?.className || 'bg-gray-100 text-gray-800 border-gray-300'}`}
              >
                {statusConfig[document.status]?.icon}
                {document.status}
              </Badge>
            )}
          </div>
          
          {/* Grid Layout for Fields */}
          <div className="grid grid-cols-2 gap-3">
            {/* Type */}
            <div className="flex items-start gap-2 p-2 rounded-lg bg-muted/50">
              <FileText className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground mb-0.5">Тип</p>
                <p className="text-sm font-medium truncate">{document.type || '-'}</p>
              </div>
            </div>

            {/* Date */}
            <div className="flex items-start gap-2 p-2 rounded-lg bg-muted/50">
              <Calendar className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground mb-0.5">Дата отправки</p>
                <p className="text-sm font-medium truncate">{formatDate(document.created_at)}</p>
              </div>
            </div>

            {/* Document ID */}
            <div className="flex items-start gap-2 p-2 rounded-lg bg-muted/50 col-span-2">
              <Hash className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground mb-0.5">ID документа</p>
                <p className="text-sm font-medium truncate">{document.id || '-'}</p>
              </div>
            </div>

            {/* Sender */}
            <div className="flex items-start gap-2 p-2 rounded-lg bg-muted/50">
              <User className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground mb-0.5">Отправитель</p>
                <p className="text-sm font-medium truncate">{document.sender_full_name || '-'}</p>
              </div>
            </div>

            {/* Receiver */}
            <div className="flex items-start gap-2 p-2 rounded-lg bg-muted/50">
              <User className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground mb-0.5">Получатель</p>
                <p className="text-sm font-medium truncate">
                  {document.members && document.members.length > 0 
                    ? document.members[document.members.length - 1].member_full_name 
                    : '-'}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default DocFileCard;
