import { SchedulePage } from "pages/schedule";
import { EmployeeDashboardPlaceholder } from "pages/EmployeeDashboardPlaceholder/EmployeeDashboardPlaceholder";

export function HomePage() {
  const role = "employee"; // Пример роли пользователя
  return (
    <div>
      <div className="mx-auto space-y-8">
        {role === "employee" ?
        <EmployeeDashboardPlaceholder />
         : 
        <SchedulePage />
        }
      </div>
    </div>
  );
}
