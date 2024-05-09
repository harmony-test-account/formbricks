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
    <div className="rounded-lg border border-slate-200 bg-white px-4 py-6 shadow-sm 2xl:pl-[7px]">
      <Headline headline={getLocalizedValue(questionSummary.question.headline, "default")} />

      <div className="flex space-x-2 text-xs font-semibold text-slate-600 md:text-sm ml-[9px] mt-2">
        <div className=" flex items-center rounded-lg p-2 ">
          {questionTypeInfo && <questionTypeInfo.icon className="mr-2 h-4 w-4 " />}
          <span>{questionTypeInfo ? questionTypeInfo.label : "Unknown Question Type"}</span>
        </div>
        <div className=" flex items-center rounded-lg p-2">
          <InboxIcon className="mr-2 h-4 w-4 " />
          <span>{questionSummary.responseCount} responses</span>
        </div>
        {!questionSummary.question.required && (
          <div className="flex items-center  rounded-lg p-2">Optional</div>
        )}
      </div>
      <div className="text mt-4 flex justify-between px-2 pb-2 ml-[9px] mb-5">
        <div className="mr-8 flex space-x-1">
          <p className="font-semibold text-slate-700">
            Clickthrough Rate (CTR) {convertFloatToNDecimal(questionSummary.ctr.percentage, 1)}%
          </p>
        </div>
        <p className="flex w-32 items-end justify-end text-slate-600">
          {questionSummary.ctr.count} {questionSummary.ctr.count === 1 ? "response" : "responses"}
        </p>
      </div>
      <ProgressBar progress={questionSummary.ctr.percentage / 100} />
    </div>
  );
}
