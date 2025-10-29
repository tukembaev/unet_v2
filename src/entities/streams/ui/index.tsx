import { useState } from "react";
import { useFlows, useWorkPlans } from "../model/queries";
import { StreamsTable } from "./StreamsTable";
import { AsyncSelect } from "shared/components";

const FlowPage = () => {
  const [selectedWorkPlan, setSelectedWorkPlan] = useState("");
  const { data: workPlans } = useWorkPlans();
  const { data: flows, isLoading } = useFlows(selectedWorkPlan);
  const fetchWorkPlans = async (query?: string) => {
    if (!workPlans) return [];
    if (!query) return workPlans;
    return workPlans.filter((faculty) =>
      faculty.label.toLowerCase().includes(query.toLowerCase())
    );
  };

  return (
    <div>
      <div className="space-y-6 p-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <h1 className="text-2xl font-bold">Потоки</h1>
          <AsyncSelect
            fetcher={fetchWorkPlans}
            label="РУП"
            value={selectedWorkPlan}
            onChange={setSelectedWorkPlan}
            renderOption={(option) => <span>{option.label}</span>}
            getOptionValue={(option) => option.value.toString()}
            getDisplayValue={(option) => option.label}
            placeholder="Выберите РУП"
            disabled={isLoading}
          />
        </div>

        <StreamsTable data={flows?.data} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default FlowPage;
