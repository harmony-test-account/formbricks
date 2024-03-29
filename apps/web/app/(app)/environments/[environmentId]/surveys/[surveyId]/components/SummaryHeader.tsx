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
    <div className="mb-6 mt-6 flex items-center justify-between">
      <div>
        <div className="flex gap-4">
          <p className="text-3xl font-bold text-slate-800">{survey.name}</p>
          {survey.resultShareKey && <Badge text="Results are public" type="warning" size="normal"></Badge>}
        </div>
        <span className="text-base font-extralight text-slate-600">{product.name}</span>
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
          className="h-full w-full px-3 lg:px-6"
          href={`/environments/${environment.id}/surveys/${surveyId}/edit`}>
          Edit
          <SquarePenIcon className="w-6 h-4 ml-0 mt-0.5" />
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
