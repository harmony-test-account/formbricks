import revalidateSurveyIdPath from "@/app/(app)/environments/[environmentId]/surveys/[surveyId]/(analysis)/actions";
import { InboxIcon, PresentationIcon } from "lucide-react";
import Link from "next/link";

import { cn } from "@formbricks/lib/cn";

interface SurveyResultsTabProps {
  activeId: string;
  environmentId: string;
  surveyId: string;
  responseCount: number | null;
}

export default function SurveyResultsTabs({
  activeId,
  environmentId,
  surveyId,
  responseCount,
}: SurveyResultsTabProps) {
  const tabs = [
    {
      id: "summary",
      label: "Summary",
      icon: <PresentationIcon className="w-5 h-full" />,
      href: `/environments/${environmentId}/surveys/${surveyId}/summary?referer=true`,
    },
    {
      id: "responses",
      label: `Responses ${responseCount !== null ? `(${responseCount})` : ""}`,
      icon: <InboxIcon className="w-5 h-full" />,
      href: `/environments/${environmentId}/surveys/${surveyId}/responses?referer=true`,
    },
  ];

  return (
    <div className="mb-7 flex h-14 border-b gap-0">
      <Link
className="gap-[8.01041px] items-end mb-[0.0104179px] pb-[16.6667px] px-[11.9896px]"         key={tabs[0].id}
        onClick={() => {
          revalidateSurveyIdPath(environmentId, surveyId);
        }}
        href={tabs[0].href}
        className={cn(
          tabs[0].id === activeId
            ? " border-brand-dark text-brand-dark border-b-2 font-semibold"
            : "text-slate-500 hover:text-slate-700",
          "flex items-center px-3 text-sm font-medium"
        )}
        aria-current={tabs[0].id === activeId ? "page" : undefined}>
        {tabs[0].icon && <div className="h-5 w-5 mr-0">{tabs[0].icon}</div>}
        {tabs[0].label}
      </Link>
      <Link
className="gap-[9.79166px] items-start justify-end pl-[11.9896px] pr-[10.1875px] pt-[17.6563px] pb-0"         key={tabs[1].id}
        onClick={() => {
          revalidateSurveyIdPath(environmentId, surveyId);
        }}
        href={tabs[1].href}
        className={cn(
          tabs[1].id === activeId
            ? " border-brand-dark text-brand-dark border-b-2 font-semibold"
            : "text-slate-500 hover:text-slate-700",
          "flex items-center px-3 text-sm font-medium"
        )}
        aria-current={tabs[1].id === activeId ? "page" : undefined}>
        {tabs[1].icon && <div className="h-5 w-5 mr-0">{tabs[1].icon}</div>}
        {tabs[1].label}
      </Link>
    </div>
  );
}
