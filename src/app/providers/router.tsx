import { RootLayout } from "app/layouts/root-layout";
import { DocumentDetails } from "entities/documents";
import { SyllabusReport } from "entities/education-management";
import { StreamsInfo } from "entities/streams";
import { TaskDetails } from "entities/task/ui/task-details";
import { AboutPage } from "pages/about";
import { CurriculumDetailPage, CurriculumPage } from "pages/curriculum";
import DepartmentDisciplinesPage from "pages/departmen-disciplines";
import { DocumentsPage } from "pages/documents";
import EducationManagementPage from "pages/edu-management";
import { HomePage } from "pages/home";
import ItDepartmentPage from "pages/it-department";
import { KpiReportPage } from "pages/kpi-report";
import { LoginPage } from "pages/login";
import { NotFoundPage } from "pages/not-found";
import ProfilePage from "pages/profile";
import StreamsPage from "pages/streams";
import { TaskPage } from "pages/task";
import { TaskReportsPage } from "pages/task-reports";
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
        path: ROUTES.IT_DEPARTMENT,
        element: <ItDepartmentPage />,
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
        path: ROUTES.TASK_DETAILS,
        element: <TaskDetails />,
      },
      {
        path: ROUTES.APPLICATIONS,
        element: <DocumentsPage />,
      },
      {
        path: ROUTES.DOCUMENT_DETAILS,
        element: <DocumentDetails />,
      },
 
      {
        path: ROUTES.STREAMS,
        element: <StreamsPage />,
      },
      {
        path: ROUTES.STREAM_DETAILS,
        element: <StreamsInfo />,
      },
      {
        path: ROUTES.CURRICULUM_DETAIL,
        element: <CurriculumDetailPage />,
      },
      {
        path: ROUTES.CURRICULUM,
        element: <CurriculumPage />,
      },
      {
        path: ROUTES.DEPARTMENTDISCIPLINES,
        element: <DepartmentDisciplinesPage />,
      },
      {
        path: ROUTES.PERSONAL_CARD,
        element: <ProfilePage />,
      },
      {
        path: ROUTES.TASK_REPORTS,
        element: <TaskReportsPage />,
      },
      {
        path: ROUTES.KPI_REPORTS,
        element: <KpiReportPage />,
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
