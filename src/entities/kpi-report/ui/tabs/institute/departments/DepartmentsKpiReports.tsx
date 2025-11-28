import { useDepartmentsKpi } from "entities/kpi-report/model/queries";
import { Award, BarChart3, Building2 } from "lucide-react";

interface DepartmentsProps {
    id: number;
}

export const DepartmentsKpiReports = ({id}:DepartmentsProps) => {
    const {data: departmentsKpiReport} = useDepartmentsKpi(id);
    const handleClick = (id: number) => {
        // Handle click if needed
    }
  return (
   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        {departmentsKpiReport?.map((item) => {
          const passed = parseInt(item?.passed_percent?.split(".")[0]);
          const scorePassed = item?.scores?.split("/")[1];

          return (
            <div
              key={item?.id}
              onClick={() => handleClick(item?.id)}
              className="cursor-pointer rounded-2xl  border  p-4 transition   hover:-translate-y-1"
            >
              {/* header */}
              <div className="flex items-center gap-2 mb-4">
                <Building2 className="text-blue-500" size={22} />
                <h3 className="text-sm font-semibold">{item?.departament_name}</h3>
              </div>

              {/* body */}
              <div className="space-y-4">
                {/* progress */}
                <div className="flex items-start gap-3">
                  <BarChart3 size={18} className="text-gray-500" />

                  <div className="flex-1">
                    <p className="text-sm mb-1">
                      Заполняемость:{" "}
                      <span className="font-semibold text-green-600">
                        {passed}%
                      </span>
                    </p>

                    <div className="w-full h-3 bg-gray-200  rounded-full flex overflow-hidden">
                      <div
                        className="bg-green-500 h-full"
                        style={{ width: `${passed}%` }}
                      />

                    </div>
                  </div>
                </div>

                {/* scores */}
                <div className="flex items-center gap-3">
                  <Award size={18} className="text-gray-500" />
                  <p className="text-sm">
                    Баллы института:{" "}
                    <span className="font-semibold text-green-600">
                      {scorePassed === "None" ? 0 : scorePassed}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
  )
}
