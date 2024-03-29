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
    <div className="rounded-lg border border-slate-200 bg-white px-4 py-6 shadow-sm pl-0 pr-[7.29688px] pt-[9.55469px] pb-0">
      <Headline headline={getLocalizedValue(questionSummary.question.headline, "default")} />

      <div className="flex space-x-2 text-xs font-semibold text-slate-600 md:text-sm gap-[135.305px] ml-[6.55469px] mr-[18.125px] mt-[12.3672px]">
        <div className="flex rounded-lg p-2 gap-[9.08594px] items-end pl-[6.90625px] pr-[8.01562px] pb-[0.0078125px]">
          {questionTypeInfo && <questionTypeInfo.icon className="w-[15.9922px] h-[15.9922px] mr-0" />}
          <span className="mb-[7.99219px]" >{questionTypeInfo ? questionTypeInfo.label : "Unknown Question Type"}</span>
        </div>
        <div className="flex rounded-lg p-2 gap-[14.5234px] items-start ml-0 pl-[4.71094px] pr-[4.73438px] pt-0 pb-[0.0078125px]">
          <InboxIcon className="w-[15.9922px] h-5 mr-0" />
          <span className="mt-[15.9922px]" >{questionSummary.responseCount} responses</span>
        </div>
        {!questionSummary.question.required && (
          <div className="flex items-center  rounded-lg p-2">Optional</div>
        )}
      </div>
      <div className="text flex justify-between px-2 pb-2 gap-[820.211px] items-start ml-[15.1953px] mr-[9.46875px] mt-[15.0781px] mb-0 pl-[6.90625px] pr-0">
        <div className="flex space-x-1 items-start mr-0">
          <p className="font-semibold text-slate-700">
            Clickthrough Rate (CTR) {convertFloatToNDecimal(questionSummary.ctr.percentage, 1)}%
          </p>
        </div>
        <p className="flex items-end justify-end text-slate-600 w-[127.992px]">
          {questionSummary.ctr.count} {questionSummary.ctr.count === 1 ? "response" : "responses"}
        </p>
      </div>
      <ProgressBar progress={questionSummary.ctr.percentage / 100} />
    </div>
  );
}
