import { RootLayout } from "app/layouts/root-layout";
import { DocumentDetails } from "entities/documents";
import { SyllabusReport } from "entities/education-management";
import { AboutPage } from "pages/about";
import { DocumentsPage } from "pages/documents";
import EducationManagementPage from "pages/edu-management";
import { HomePage } from "pages/home";
import { LoginPage } from "pages/login";
import { NotFoundPage } from "pages/not-found";
import { TaskPage } from "pages/task";
import { createBrowserRouter, RouteObject } from "react-router-dom";
import { ROUTES } from "./routes";


// Re-export routes for convenience
export { getRoute, ROUTES, type RoutePath } from "./routes";

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
      {
        path: ROUTES.APPLICATIONS,
        element: <DocumentsPage />,
      },
      {
        path: ROUTES.DOCUMENT_DETAILS,
        element: <DocumentDetails />,
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
