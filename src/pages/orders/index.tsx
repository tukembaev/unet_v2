import { PageHeader } from 'widgets/page-header';
import { OrdersContent } from 'entities/orders';

export const OrdersPage = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Приказы"
        description="Управление входящими и исходящими приказами"
      />

      <OrdersContent />
    </div>
  );
};

