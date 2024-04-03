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
    <div className="rounded-lg border border-slate-200 bg-white px-4 py-6 shadow-sm pl-0 pr-[16.1172px] pt-0 pb-[26px]">
      <Headline headline={getLocalizedValue(questionSummary.question.headline, "default")} />

      <div className="flex space-x-2 text-xs font-semibold text-slate-600 md:text-sm gap-0 -ml-px mr-0 mt-[7.9375px] pl-2 py-0">
        <div className="flex rounded-lg p-2 gap-0 items-start mb-[15.9844px] pl-0 pr-[24.0078px] py-0">
          {questionTypeInfo && <questionTypeInfo.icon className="w-4 h-[15.9922px] mr-0 mt-5" />}
          <span>{questionTypeInfo ? questionTypeInfo.label : "Unknown Question Type"}</span>
        </div>
        <div className="flex rounded-lg p-2 justify-end gap-[15.9922px] items-start ml-0 pl-[3.9375px] pr-[0.0078125px] pt-0 pb-[15.9766px]">
          <InboxIcon className="h-[15.9922px] w-5 mr-0 mt-5" />
          <span className="mb-0" >{questionSummary.responseCount} responses</span>
        </div>
        {!questionSummary.question.required && (
          <div className="flex items-center  rounded-lg p-2">Optional</div>
        )}
      </div>
      <div className="text flex justify-between gap-0 items-end ml-[8.53906px] mr-[6.44531px] my-0 pt-[9.72656px] pb-[8.01562px] px-0">
        <div className="flex space-x-1 items-start mr-0">
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
