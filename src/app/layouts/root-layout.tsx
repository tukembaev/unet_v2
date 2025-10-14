import { Outlet } from "react-router-dom";
import { Navbar } from "widgets/navbar";

export function RootLayout() {
  return (
    <div className=" min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="container mx-auto px-4 pb-12 pt-6">
          <Outlet />
        </div>
      </main>
      <footer className="border-t mt-auto">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Unet V2. Built with React 19, Vite, and
          FSD architecture.
        </div>
      </footer>
    </div>
  );
}
