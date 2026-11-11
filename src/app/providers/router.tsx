import { RootLayout } from "app/layouts/root-layout";
import { DocumentDetails } from "entities/documents";
import { SyllabusReport } from "entities/education-management";
import { StreamsInfo } from "entities/streams";
import { TaskDetails } from "entities/task/ui/task-details";
import { AboutPage } from "pages/about";
import { CurriculumDetailPage, CurriculumPage } from "pages/curriculum";
import DepartmentDisciplinesPage from "pages/departmen-disciplines";
import { DocumentsPage } from "pages/documents";
import UdocPage from "pages/udoc";
import UdocDetailPage from "pages/udoc/detail";
import EducationManagementPage from "pages/edu-management";
import DispatcherStreamPage from "pages/dispatcher-stream";
import { HomePage } from "pages/home";
import ItDepartmentPage from "pages/it-department";
import { KpiReportPage } from "pages/kpi-report";
import { KpiEmployeePage } from "pages/kpi-employee";
import { LoginPage } from "pages/login";
import { NotFoundPage } from "pages/not-found";
import ProfilePage from "pages/profile";
import { SchedulePage } from "pages/schedule";
import StudentRegistrationPage from "pages/student-registration";
import MyDisciplinesPage from "pages/my-disciplines";
import StudentTicketPage from "pages/student-ticket";
import SupportPage from "pages/support";
import AppealsPage from "pages/appeals";
import StreamsPage from "pages/streams";
import { TaskPage } from "pages/task";
import { TaskReportsPage } from "pages/task-reports";
import AuditoriumFundPage from "pages/auditorium-fund";
import TabelReportPage from "pages/tabel-report";
import SurveysPage from "pages/surveys";
import StudentSurveysPage from "pages/surveys/student";
import PublicSurveyPage from "pages/surveys/public";
import WorkloadPage from "pages/workload";
import { createBrowserRouter, RouteObject } from "react-router-dom";
import { AccessGuard } from "./AccessGuard";
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
    path: ROUTES.SUPPORT,
    element: <SupportPage />,
  },
  {
    path: ROUTES.SURVEY_PUBLIC,
    element: <PublicSurveyPage />,
  },
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <NotFoundPage />,
    children: [
      {
        element: <AccessGuard />,
        children: [
          {
            path: ROUTES.HOME,
            index: true,
            element: <HomePage />,
          },
          {
            path: ROUTES.SCHEDULE,
            element: <SchedulePage />,
          },
          {
            path: ROUTES.STUDENT_REGISTRATION,
            element: <StudentRegistrationPage />,
          },
          {
            path: ROUTES.MY_DISCIPLINES,
            element: <MyDisciplinesPage />,
          },
          {
            path: ROUTES.STUDENT_TICKET,
            element: <StudentTicketPage />,
          },
          {
            path: ROUTES.STUDENT_SURVEYS,
            element: <StudentSurveysPage />,
          },
          {
            path: ROUTES.SURVEYS,
            element: <SurveysPage />,
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
            path: ROUTES.APPEALS,
            element: <AppealsPage />,
          },
          {
            path: ROUTES.EDUCATION_MANAGEMENT,
            element: <EducationManagementPage />,
          },
          {
            path: ROUTES.DISPATCHER_STREAM,
            element: <DispatcherStreamPage />,
          },
          {
            path: `${ROUTES.REPORT_SYLLABUS}/:syllabusId/:profileId`,
            element: <SyllabusReport />,
          },
          {
            path: `${ROUTES.REPORT_SYLLABUS}/:syllabusId`,
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
            path: ROUTES.UDOC_DETAILS,
            element: <UdocDetailPage />,
          },
          {
            path: ROUTES.UDOC,
            element: <UdocPage />,
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
            path: ROUTES.WORKLOAD,
            element: <WorkloadPage />,
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
            path: ROUTES.AUDITORIUM_FUND,
            element: <AuditoriumFundPage />,
          },
          {
            path: ROUTES.TABEL_REPORT,
            element: <TabelReportPage />,
          },
          {
            path: ROUTES.KPI_REPORTS,
            element: <KpiReportPage />,
          },
          {
            path: `${ROUTES.KPI_EMPLOYEE}/:userId`,
            element: <KpiEmployeePage />,
          },
        ],
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
