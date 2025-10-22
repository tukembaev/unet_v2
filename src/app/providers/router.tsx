import { createBrowserRouter, RouteObject } from "react-router-dom";
import { HomePage } from "pages/home";
import { AboutPage } from "pages/about";
import { NotFoundPage } from "pages/not-found";
import { RootLayout } from "app/layouts/root-layout";
import { ROUTES } from "./routes";
import { LoginPage } from "pages/login";
import EducationManagementPage from "pages/edu-management";
import { TaskPage } from "pages/task";
import { SyllabusReport } from "entities/education-management";

// Re-export routes for convenience
export { ROUTES, getRoute, type RoutePath } from "./routes";

// Define your routes with proper typing
const routes: RouteObject[] = [
  {
    path: ROUTES.AUTH,
    element: <LoginPage />,
  },
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <NotFoundPage />,
    children: [
      {
        path: ROUTES.HOME,
        index: true,
        element: <HomePage />,
      },
      {
        path: ROUTES.ABOUT,
        element: <AboutPage />,
      },
      {
        path: ROUTES.EDUCATION_MANAGEMENT,
        element: <EducationManagementPage />,
      },
      {
        path: `${ROUTES.REPORT_SYLLABUS}/:syllabusId/:profileId`,
        element: <SyllabusReport />,
      },
      {
        path: ROUTES.TASK,
        element: <TaskPage />,
      },
    ],
    
  },
 
  {
    path: "*",
    element: <NotFoundPage />,
  },
];

// Create and export the router
export const router = createBrowserRouter(routes);
