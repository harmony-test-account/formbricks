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
    <p className="flex text-sm text-slate-600">
      {label}
      {percentage && percentage !== "NaN%" && (
        <span className="ml-1 rounded-xl bg-slate-100 px-2 py-1 text-xs">{percentage}</span>
      )}
    </p>
    <p className="px-0.5 text-2xl font-bold text-slate-800 mr-[71.2578px] mt-0">{value}</p>
  </div>
);

export default function SummaryMetadata({ surveySummary }: SummaryMetadataProps) {
  const { completedPercentage, completedResponses, displayCount, startsPercentage, totalResponses } =
    surveySummary;

  return (
    <div className="flex flex-col-reverse py-4 lg:flex-row lg:gap-x-2 gap-[139.234px] ml-[158.789px] mr-[157.18px] mt-0 pl-[30.8125px] pt-0 pb-[24.4766px]">
      <StatCard
className="mt-[29.875px] mb-[5.<StatCard
className="__className_af7b73 "         label="Displays"
        percentage="100%"
        value={displayCount === 0 ? <span>-</span> : displayCount}
        tooltipText="Number of times the survey has been viewed."
      />
      <StatCard
className="gap-[8.01562px] justify-end ml-0 my-0 pl-[15.9688px] pr-[126.008px] pt-0 pb-[0.<StatCard
className="__className_6d65e1 "         label="Starts"
        percentage={`${Math.round(startsPercentage)}%`}
        value={totalResponses === 0 ? <span>-</span> : totalResponses}
        tooltipText="Number of times the survey has been started."
      />
      <StatCard
className="ml-[13.625px] mt-[29.875px] mb-[5.46875px]"         label="Responses"
        percentage={`${Math.round(completedPercentage)}%`}
        value={completedResponses === 0 ? <span>-</span> : completedResponses}
        tooltipText="Number of times the survey has been completed."
      />
    </div>
  );
}
