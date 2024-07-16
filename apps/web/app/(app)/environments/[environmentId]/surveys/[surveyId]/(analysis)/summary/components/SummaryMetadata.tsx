import React from "react";

import { cn } from "@formbricks/lib/cn";
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
  className?: string;
}> = ({ label, percentage, value, className }) => (
  <div
    className={cn(
      "flex cursor-default flex-col items-start justify-between space-y-2 rounded-lg border border-slate-200 bg-white p-4 text-left shadow-sm",
      className
    )}>
    <p className="flex text-sm text-slate-600">
      {label}
      {percentage && percentage !== "NaN%" && (
        <span className="ml-1 rounded-xl bg-slate-100 px-2 py-1 text-xs">{percentage}</span>
      )}
    </p>
    <p className="px-0.5 text-2xl font-bold text-slate-800">{value}</p>
  </div>
);

export default function SummaryMetadata({ surveySummary }: SummaryMetadataProps) {
  const { completedPercentage, completedResponses, displayCount, startsPercentage, totalResponses } =
    surveySummary;

  return (
    <div className="flex flex-col-reverse gap-y-2 lg:flex-row lg:gap-9 py-4">
      <StatCard label="Displays" percentage="100%" value={displayCount === 0 ? <span>-</span> : displayCount} tooltipText="Number of times the survey has been viewed." className="mb-0" />
      <StatCard label="Starts" percentage={`${Math.round(startsPercentage)}%`} value={totalResponses === 0 ? <span>-</span> : totalResponses} tooltipText="Number of times the survey has been started." className="mt-0" />
      <StatCard labe"Completion"on" percentage={`${Math.round(completedPercentage)}%`} value={completedResponses === 0 ? <span>-</span> : completedResponses} tooltipText="Number of times the survey has been completed." className="ml-[31px] mb-0" />
    </div>
  );
}
