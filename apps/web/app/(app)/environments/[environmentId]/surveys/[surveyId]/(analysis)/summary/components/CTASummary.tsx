import Headline from "@/app/(app)/environments/[environmentId]/surveys/[surveyId]/(analysis)/summary/components/Headline";
import { convertFloatToNDecimal } from "@/app/(app)/environments/[environmentId]/surveys/[surveyId]/(analysis)/summary/lib/util";
import { questionTypes } from "@/app/lib/questions";
import { InboxIcon } from "lucide-react";

import { getLocalizedValue } from "@formbricks/lib/i18n/utils";
import { TSurveySummaryCta } from "@formbricks/types/responses";
import { ProgressBar } from "@formbricks/ui/ProgressBar";

interface CTASummaryProps {
  questionSummary: TSurveySummaryCta;
}

export default function CTASummary({ questionSummary }: CTASummaryProps) {
  const questionTypeInfo = questionTypes.find((type) => type.id === questionSummary.question.type);

  return (
    <div className="rounded-lg border border-slate-200 bg-white px-4 py-6 shadow-sm pl-0 pr-[7px] pt-2.5 pb-0">
      <Headline headline={getLocalizedValue(questionSummary.question.headline, "default")} />

      <div className="flex space-x-2 text-xs font-semibold text-slate-600 md:text-sm gap-[135px] ml-[7px] mr-[18px] mt-3">
        <div className="flex rounded-lg p-2 gap-[9px] items-end pl-[7px] pr-2 pb-0">
          {questionTypeInfo && <questionTypeInfo.icon className="w-4 h-4 mr-0" />}
          <span className="mb-2" >{questionTypeInfo ? questionTypeInfo.label : "Unknown Question Type"}</span>
        </div>
        <div className="flex rounded-lg p-2 gap-[15px] items-start ml-0 px-[5px] py-0">
          <InboxIcon className="w-4 h-5 mr-0" />
          <span className="mt-4" >{questionSummary.responseCount} responses</span>
        </div>
        {!questionSummary.question.required && (
          <div className="flex items-center  rounded-lg p-2">Optional</div>
        )}
      </div>
      <div className="text flex justify-between px-2 pb-2 gap-[820px] items-start ml-[15px] mr-[9px] mt-[15px] mb-0 pl-[7px] pr-0">
        <div className="flex space-x-1 items-start mr-0">
          <p className="font-semibold text-slate-700">
            Clickthrough Rate (CTR) {convertFloatToNDecimal(questionSummary.ctr.percentage, 1)}%
          </p>
        </div>
        <p className="flex items-end justify-end text-slate-600 w-32">
          {questionSummary.ctr.count} {questionSummary.ctr.count === 1 ? "response" : "responses"}
        </p>
      </div>
      <ProgressBar progress={questionSummary.ctr.percentage / 100} />
    </div>
  );
}
