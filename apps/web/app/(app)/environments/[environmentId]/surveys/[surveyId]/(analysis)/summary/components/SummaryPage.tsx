"use client";

import { useResponseFilter } from "@/app/(app)/environments/[environmentId]/components/ResponseFilterContext";
import {
  getResponseCountAction,
  getSurveySummaryAction,
} from "@/app/(app)/environments/[environmentId]/surveys/[surveyId]/(analysis)/actions";
import SurveyResultsTabs from "@/app/(app)/environments/[environmentId]/surveys/[surveyId]/(analysis)/components/SurveyResultsTabs";
import SummaryDropOffs from "@/app/(app)/environments/[environmentId]/surveys/[surveyId]/(analysis)/summary/components/SummaryDropOffs";
import SummaryList from "@/app/(app)/environments/[environmentId]/surveys/[surveyId]/(analysis)/summary/components/SummaryList";
import SummaryMetadata from "@/app/(app)/environments/[environmentId]/surveys/[surveyId]/(analysis)/summary/components/SummaryMetadata";
import CustomFilter from "@/app/(app)/environments/[environmentId]/surveys/[surveyId]/components/CustomFilter";
import SummaryHeader from "@/app/(app)/environments/[environmentId]/surveys/[surveyId]/components/SummaryHeader";
import { getFormattedFilters } from "@/app/lib/surveys/surveys";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { checkForRecallInHeadline } from "@formbricks/lib/utils/recall";
import { TEnvironment } from "@formbricks/types/environment";
import { TMembershipRole } from "@formbricks/types/memberships";
import { TProduct } from "@formbricks/types/product";
import { TSurveyPersonAttributes, TSurveySummary } from "@formbricks/types/responses";
import { TSurvey } from "@formbricks/types/surveys";
import { TTag } from "@formbricks/types/tags";
import { TUser } from "@formbricks/types/user";
import ContentWrapper from "@formbricks/ui/ContentWrapper";

const initialSurveySummary: TSurveySummary = {
  meta: {
    completedPercentage: 0,
    completedResponses: 0,
    displayCount: 0,
    dropOffPercentage: 0,
    dropOffCount: 0,
    startsPercentage: 0,
    totalResponses: 0,
    ttcAverage: 0,
  },
  dropOff: [],
  summary: [],
};

interface SummaryPageProps {
  environment: TEnvironment;
  survey: TSurvey;
  surveyId: string;
  webAppUrl: string;
  product: TProduct;
  user: TUser;
  environmentTags: TTag[];
  attributes: TSurveyPersonAttributes;
  membershipRole?: TMembershipRole;
}

const SummaryPage = ({
  environment,
  survey,
  surveyId,
  webAppUrl,
  product,
  user,
  environmentTags,
  attributes,
  membershipRole,
}: SummaryPageProps) => {
  const [responseCount, setResponseCount] = useState<number | null>(null);
  const { selectedFilter, dateRange, resetState } = useResponseFilter();
  const [surveySummary, setSurveySummary] = useState<TSurveySummary>(initialSurveySummary);
  const [showDropOffs, setShowDropOffs] = useState<boolean>(false);

  const filters = useMemo(
    () => getFormattedFilters(survey, selectedFilter, dateRange),
    [survey, selectedFilter, dateRange]
  );

  useEffect(() => {
    const handleInitialData = async () => {
      const responseCount = await getResponseCountAction(surveyId, filters);
      setResponseCount(responseCount);
      if (responseCount === 0) {
        setSurveySummary(initialSurveySummary);
        return;
      }
      const response = await getSurveySummaryAction(surveyId, filters);
      setSurveySummary(response);
    };

    handleInitialData();
  }, [filters, surveyId]);

  const searchParams = useSearchParams();

  survey = useMemo(() => {
    return checkForRecallInHeadline(survey, "default");
  }, [survey]);

  useEffect(() => {
    if (!searchParams?.get("referer")) {
      resetState();
    }
  }, [searchParams, resetState]);

  return (
    <ContentWrapper className="mx-0 pl-[11.4844px] pr-6 pt-[47.9922px] pb-[61.0625px]" >
      <SummaryHeader
className="items-start h-auto w-auto justify-end gap-[700.984px] ml-[89.2188px] my-0 pr-[0.0078125px]"         environment={environment}
        survey={survey}
        surveyId={surveyId}
        webAppUrl={webAppUrl}
        product={product}
        user={user}
        membershipRole={membershipRole}
      />
      <CustomFilter className="gap-[5.78125px] mr-[4.5px] mt-[19.5469px] mb-0 pt-[19.9219px] pb-[48.4922px]" environmentTags={environmentTags} attributes={attributes} survey={survey} />
      <SurveyResultsTabs
className="w-[19.9922px] justify-end h-full items-start gap-[133.82px] ml-[12.5px] mr-0 mt-[0.0078125px] mb-0 pl-[7.63281px] pr-[98px] pt-[7.6875px] pb-[5.63281px]"         activeId="summary"
        environmentId={environment.id}
        surveyId={surveyId}
        responseCount={responseCount}
      />
      <SummaryMetadata
        survey={survey}
        surveySummary={surveySummary.meta}
        showDropOffs={showDropOffs}
        setShowDropOffs={setShowDropOffs}
      />
      {showDropOffs && <SummaryDropOffs dropOff={surveySummary.dropOff} />}
      <SummaryList
        summary={surveySummary.summary}
        responseCount={responseCount}
        survey={survey}
        environment={environment}
      />
    </ContentWrapper>
  );
};

export default SummaryPage;
