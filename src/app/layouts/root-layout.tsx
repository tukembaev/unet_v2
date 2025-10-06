import { Outlet, Link } from 'react-router-dom';
import { Button } from 'shared/ui';
import { ROUTES } from 'app/providers/router';

export function RootLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <header className="border-b">
        <nav className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to={ROUTES.HOME} className="text-xl font-bold hover:text-primary transition-colors">
              Unet V2
            </Link>
            <div className="flex gap-4">
              <Link to={ROUTES.HOME}>
                <Button variant="ghost">Home</Button>
              </Link>
              <Link to={ROUTES.ABOUT}>
                <Button variant="ghost">About</Button>
              </Link>
            </div>
          </div>
        </nav>
      </header>

      {/* Main content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t mt-auto">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Unet V2. Built with React 19, Vite, and FSD architecture.
        </div>
      </footer>
    </div>
  );
}
