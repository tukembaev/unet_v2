import { createBrowserRouter, RouteObject } from 'react-router-dom';
import { HomePage } from 'pages/home';
import { AboutPage } from 'pages/about';
import { NotFoundPage } from 'pages/not-found';
import { RootLayout } from 'app/layouts/root-layout';
import { ROUTES } from './routes';

// Re-export routes for convenience
export { ROUTES, getRoute, type RoutePath } from './routes';

// Define your routes with proper typing
const routes: RouteObject[] = [
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <NotFoundPage />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: ROUTES.ABOUT,
        element: <AboutPage />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
];

// Create and export the router
export const router = createBrowserRouter(routes);

