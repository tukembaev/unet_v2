import { CreateTaskDialog } from "features/create-task";
import { Outlet } from "react-router-dom";
import { cn } from "shared/lib/utils";
import { Card } from "shared/ui";
import { Navbar } from "widgets/navbar";


export function RootLayout() {
  return (
    <div className="relative flex min-h-screen flex-col">
      <div
        className={cn(
          "pointer-events-none fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat",
          "bg-[url('shared/assets/img/LayoutBackgroud.jpg')]"
        )}
        aria-hidden
      />
      <Navbar />
      <main className="flex-1">
        <div className="px-8 pb-12 pt-6">
          <Card className={cn("rounded-2xl p-6 shadow-md")}>
            <Outlet />
          </Card>
        </div>
      </main>
      <footer className="mt-auto">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Unet V2. Built with React 19, Vite, and
          FSD architecture.
        </div>
      </footer>
      
      {/* Global Dialogs */}
      <CreateTaskDialog />
    </div>
  );
}
