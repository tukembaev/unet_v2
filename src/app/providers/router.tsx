import { createBrowserRouter, RouteObject } from 'react-router-dom';
import { HomePage } from 'pages/home';
import { AboutPage } from 'pages/about';
import { NotFoundPage } from 'pages/not-found';
import { RootLayout } from 'app/layouts/root-layout';

// Define route paths as constants for type safety
export const ROUTES = {
  HOME: '/',
  ABOUT: '/about',
  // Add more routes here as needed
} as const;

// Type for route paths
export type RoutePath = typeof ROUTES[keyof typeof ROUTES];

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

// Type-safe navigation helper
export function getRoute(path: RoutePath, params?: Record<string, string>): string {
  let route = path as string;
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      route = route.replace(`:${key}`, value);
    });
  }
  
  return route;
}

