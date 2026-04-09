import { AuditoryFundTable, useAuditoryFundRooms } from 'entities/reports/auditory-fund';

export default function AuditoriumFundPage() {
  const roomsQuery = useAuditoryFundRooms();

  return (
    <div className="space-y-6 p-6">
      <AuditoryFundTable
        rooms={roomsQuery.data ?? []}
        isLoading={roomsQuery.isLoading}
        isRefreshing={roomsQuery.isFetching}
        errorMessage={roomsQuery.error instanceof Error ? roomsQuery.error.message : undefined}
        onRefresh={() => {
          void roomsQuery.refetch();
        }}
      />
    </div>
  );
}
