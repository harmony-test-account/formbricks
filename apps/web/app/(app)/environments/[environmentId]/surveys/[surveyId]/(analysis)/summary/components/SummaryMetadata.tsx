import React from "react";

import { TSurveySummary } from "@formbricks/types/responses";
import { TSurvey } from "@formbricks/types/surveys";

interface SummaryMetadataProps {
  survey: TSurvey;
  setShowDropOffs: React.Dispatch<React.SetStateAction<boolean>>;
  showDropOffs: boolean;
  surveySummary: TSurveySummary["meta"];
}

const StatCard: React.FunctionComponent<{
  label: string;
  percentage: string;
  value: React.ReactNode;
  tooltipText: string;
}> = ({ label, percentage, value }) => (
  <div className="flex cursor-default flex-col items-start justify-between space-y-2 rounded-lg border border-slate-200 bg-white p-4 text-left shadow-sm">
    <p className="flex text-sm text-slate-600 ml-0">
      {label}
      {percentage && percentage !== "NaN%" && (
        <span className="ml-1 rounded-xl bg-slate-100 px-2 py-1 text-xs">{percentage}</span>
      )}
    </p>
    <p className="px-0.5 text-2xl font-bold text-slate-800 ml-1 mr-[102px] mt-0">{value}</p>
  </div>
);

export default function SummaryMetadata({ surveySummary }: SummaryMetadataProps) {
  const { completedPercentage, completedResponses, displayCount, startsPercentage, totalResponses } =
    surveySummary;

  return (
    <div className="flex flex-col-reverse py-4 lg:flex-row lg:gap-x-2 gap-[62px] ml-[13px] mt-7 pt-0 pb-4">
      <StatCard
className="mt-4"         label="Displays"
        percentage="100%"
        value={displayCount === 0 ? <span>-</span> : displayCount}
        tooltipText="Number of times the survey has been viewed."
      />
      <StatCard
className="ml-[90px] mt-4"         label="Starts"
        percentage={`${Math.round(startsPercentage)}%`}
        value={totalResponses === 0 ? <span>-</span> : totalResponses}
        tooltipText="Number of times the survey has been started."
      />
      <StatCard
className="justify-end gap-2.5 ml-0 mb-4 pl-[79px] pr-[21px] pt-0 pb-3.5"         label="Responses"
        percentage={`${Math.round(completedPercentage)}%`}
        value={completedResponses === 0 ? <span>-</span> : completedResponses}
        tooltipText="Number of times the survey has been completed."
      />
    </div>
  );
}
