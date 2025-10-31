import { useParams } from 'react-router-dom';
import PageHeader from 'widgets/page-header/page-header';
import OrderApprovalFlow from './approval-chain/OrderApprovalFlow';
import OrderDetailsSkeleton from './OrderDetailsSkeleton';
import PdfViewer from 'shared/components/pdf-viewer/PdfViewer';
import { Card, CardContent } from 'shared/ui';
import { Separator } from 'shared/ui/separator';
import { FileText, Calendar, Hash, User } from 'lucide-react';
import { GenericHistory } from 'shared/components';
import { useOrderDetails, useOrderHistory } from '../../model/queries';

const OrderDetails = () => {
  const { id } = useParams<{ id: string }>();
  const orderId = id ? parseInt(id, 10) : 0;

  const { data: order, isLoading } = useOrderDetails(orderId);
  const { data: history, isLoading: isHistoryLoading } = useOrderHistory(orderId);

  if (isLoading) {
    return <OrderDetailsSkeleton />;
  }

  if (!order) {
    return (
      <div className="container mx-auto p-4 md:p-6">
        <p>Приказ не найден</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      <PageHeader
        title="Детали приказа"
        description="Просмотр процесса согласования и подписания приказа"
      />

      {/* Секция описания приказа */}
      <div className="space-y-3">
        <h2 className="text-lg font-bold flex items-center gap-2">Описание приказа</h2>
        <p className="text-base md:text-lg text-foreground/80 leading-relaxed">
          {order.title}
        </p>
      </div>

      {/* Split layout: PDF слева, карточки справа */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Left side - PDF Viewer и Approval Flow */}
        <div className="w-full flex flex-col gap-4">
          {/* Main PDF File */}
          {order.file && <PdfViewer url={order.file} />}

          {/* Additional Files */}
          {order.file_2 && (
            <div className="space-y-2">
              <h3 className="text-sm font-semibold">Дополнительный файл 2</h3>
              <PdfViewer url={order.file_2} />
            </div>
          )}

          {order.file_sign && (
            <div className="space-y-2">
              <h3 className="text-sm font-semibold">Подписанный файл</h3>
              <PdfViewer url={order.file_sign} />
            </div>
          )}

          {/* Approval Flow */}
          <OrderApprovalFlow
            orderMembers={order.ordermember}
            employeeName={order.employee.surname_name}
            employeePhoto={order.employee.imeag}
          />
        </div>

        {/* Right side - Order Info Card */}
        <div className="w-full space-y-4 md:space-y-6">
          <Card className="hover:shadow-md transition-all duration-200">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Карточка приказа
              </h3>

              <div className="space-y-4">
                {/* Order Number */}
                {order.order_number && (
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                    <Hash className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted-foreground font-medium mb-1">
                        Номер оборота
                      </p>
                      <p className="text-sm font-medium">{order.order_number}</p>
                    </div>
                  </div>
                )}

                {/* Document Number */}
                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                  <Hash className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground font-medium mb-1">
                      Номер документа
                    </p>
                    <p className="text-sm font-medium">{order.number}</p>
                  </div>
                </div>

                {/* Date */}
                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                  <Calendar className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground font-medium mb-1">
                      Дата подачи
                    </p>
                    <p className="text-sm font-medium">{order.date_zayavki}</p>
                  </div>
                </div>

                {/* Order Date */}
                {order.order_date && (
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                    <Calendar className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted-foreground font-medium mb-1">
                        Дата приказа
                      </p>
                      <p className="text-sm font-medium">{order.order_date}</p>
                    </div>
                  </div>
                )}

                {/* Sender Info */}
                <div className="border-t pt-4">
                  <p className="text-xs text-muted-foreground font-semibold mb-3">
                    Сведения о заявителе
                  </p>

                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                      <User className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-muted-foreground font-medium mb-1">
                          Заявитель
                        </p>
                        <p className="text-sm font-medium">{order.employee.surname_name}</p>
                      </div>
                    </div>

                    {order.position && (
                      <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                        <User className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-muted-foreground font-medium mb-1">
                            Должность
                          </p>
                          <p className="text-sm font-medium">{order.position}</p>
                        </div>
                      </div>
                    )}

                    {order.division && (
                      <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                        <User className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-muted-foreground font-medium mb-1">
                            Подразделение
                          </p>
                          <p className="text-sm font-medium">{order.division}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Refusal info if rejected */}
                {order.prich_pr_otkaz && (
                  <div className="border-t pt-4">
                    <p className="text-xs text-red-600 font-semibold mb-2">Причина отказа</p>
                    <p className="text-sm text-foreground/80">{order.prich_pr_otkaz}</p>
                    {order.date_refusal && (
                      <p className="text-xs text-muted-foreground mt-2">
                        Дата отказа: {order.date_refusal}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Separator className="my-6" />

      <GenericHistory
        history={history}
        isLoading={isHistoryLoading}
        title="История приказа"
        emptyMessage="История отсутствует"
      />
    </div>
  );
};

export default OrderDetails;

