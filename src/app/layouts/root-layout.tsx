import { CreateTaskDialog } from "features/create-task";
import { Outlet } from "react-router-dom";
import { cn } from "shared/lib/utils";
import { Card } from "shared/ui";
import { Navbar } from "widgets/navbar";
import { useNotificationWebSocket } from "entities/notification";
import { useCurrentUser } from "entities/user/model/queries";


export function RootLayout() {
  const { data: currentUser } = useCurrentUser();
  useNotificationWebSocket(currentUser?.id);

  return (
    <div className="relative flex h-screen flex-col overflow-hidden">
      <div
        className={cn(
          "pointer-events-none fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat",
          "bg-[url('shared/assets/img/LayoutBackgroud.jpg')]"
        )}
        aria-hidden
      />
      <div className="shrink-0">
        <Navbar />
      </div>
      <main className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden px-3 pb-4 sm:px-6 sm:pb-8 md:px-8 md:pb-12">
          <Card
            className={cn(
              "thin-scrollbar flex min-h-0 flex-1 flex-col overflow-y-auto rounded-xl border-none p-3 sm:rounded-2xl sm:p-4 md:p-6"
            )}
          >
            <Outlet />
          </Card>
        </div>
      </main>


      {/* Global Dialogs */}
      <CreateTaskDialog />
    </div>
  );
}
