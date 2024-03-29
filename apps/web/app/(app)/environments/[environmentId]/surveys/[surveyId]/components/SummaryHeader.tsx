"use client";

import SuccessMessage from "@/app/(app)/environments/[environmentId]/surveys/[surveyId]/(analysis)/summary/components/SuccessMessage";
import { ShareIcon, SquarePenIcon } from "lucide-react";
import { useState } from "react";

import { getAccessFlags } from "@formbricks/lib/membership/utils";
import { TEnvironment } from "@formbricks/types/environment";
import { TMembershipRole } from "@formbricks/types/memberships";
import { TProduct } from "@formbricks/types/product";
import { TSurvey } from "@formbricks/types/surveys";
import { TUser } from "@formbricks/types/user";
import { Badge } from "@formbricks/ui/Badge";
import { Button } from "@formbricks/ui/Button";

import ShareEmbedSurvey from "../(analysis)/summary/components/ShareEmbedSurvey";

interface SummaryHeaderProps {
  surveyId: string;
  environment: TEnvironment;
  survey: TSurvey;
  webAppUrl: string;
  product: TProduct;
  user: TUser;
  membershipRole?: TMembershipRole;
}
const SummaryHeader = ({
  surveyId,
  environment,
  survey,
  webAppUrl,
  product,
  user,
  membershipRole,
}: SummaryHeaderProps) => {
  const { isViewer } = getAccessFlags(membershipRole);
  const [showShareSurveyModal, setShowShareSurveyModal] = useState(false);

  return (
    <div className="__className_a0bdb8 flex items-center justify-between gap-[693.422px] text-[#CE0909FF] ml-[12.6797px] mr-[24.6172px] my-0 pl-[19.4688px] pr-0 py-[8.92188px]">
      <div className="my-0 pt-0 pb-[0.03125px]" >
        <div className="flex gap-4 items-start">
          <p className="text-3xl font-bold text-[#800F62FF]">{survey.name}</p>
          {survey.resultShareKey && <Badge text="Results are public" type="warning" size="normal"></Badge>}
        </div>
        <span className="text-base font-extralight text-slate-600 mt-[1.375px]">{product.name}</span>
      </div>
      {survey.type === "link" && (
        <Button
          variant="secondary"
          onClick={() => {
            setShowShareSurveyModal(true);
          }}>
          <ShareIcon className="h-5 w-5" />
        </Button>
      )}
      {!isViewer && (
        <Button
          variant="darkCTA"
          className="px-3 lg:px-6 gap-[13.0234px] text-[#2E689EFF] justify-end leading-7 tracking-[0.8px] items-start h-auto w-auto ml-0 pl-[23.6484px] pr-[0.421875px] pt-[0.03125px] pb-[9.125px]"
          href={`/environments/${environment.id}/surveys/${surveyId}/edit`}>
          Edit
          <SquarePenIcon className="h-4 w-[23.9922px] ml-0 my-0" />
        </Button>
      )}
      <SuccessMessage environment={environment} survey={survey} webAppUrl={webAppUrl} user={user} />
      {showShareSurveyModal && (
        <ShareEmbedSurvey
          survey={survey}
          open={showShareSurveyModal}
          setOpen={setShowShareSurveyModal}
          webAppUrl={webAppUrl}
          user={user}
        />
      )}
    </div>
  );
};

export default SummaryHeader;
