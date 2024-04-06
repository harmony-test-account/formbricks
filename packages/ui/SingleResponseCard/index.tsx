"use client";

import { CheckCircle2Icon, LanguagesIcon, MailIcon, TrashIcon } from "lucide-react";
import Link from "next/link";
import React, { ReactNode, useState } from "react";

import { getLocalizedValue } from "@formbricks/lib/i18n/utils";
import { getPersonIdentifier } from "@formbricks/lib/person/util";
import { timeSince } from "@formbricks/lib/time";
import { formatDateWithOrdinal } from "@formbricks/lib/utils/datetime";
import { TEnvironment } from "@formbricks/types/environment";
import { TResponse } from "@formbricks/types/responses";
import { TSurvey, TSurveyQuestionType } from "@formbricks/types/surveys";
import { TTag } from "@formbricks/types/tags";
import { TUser } from "@formbricks/types/user";

import { getLanguageLabel } from "../../ee/multiLanguage/lib/isoLanguages";
import { PersonAvatar } from "../Avatars";
import { FileUploadResponse } from "../FileUploadResponse";
import { PictureSelectionResponse } from "../PictureSelectionResponse";
import { RatingResponse } from "../RatingResponse";
import { SurveyStatusIndicator } from "../SurveyStatusIndicator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../Tooltip";
import QuestionSkip from "./components/QuestionSkip";

export interface SingleResponseCardProps {
  survey: TSurvey;
  response: TResponse;
  user?: TUser;
  pageType: "people" | "response";
  environmentTags: TTag[];
  environment: TEnvironment;
  updateResponse?: (responseId: string, responses: TResponse) => void;
  deleteResponse?: (responseId: string) => void;
  isViewer: boolean;
}

interface TooltipRendererProps {
  shouldRender: boolean;
  tooltipContent: ReactNode;
  children: ReactNode;
}

function TooltipRenderer(props: TooltipRendererProps) {
  const { children, shouldRender, tooltipContent } = props;
  if (shouldRender) {
    return (
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger>{children}</TooltipTrigger>
          <TooltipContent>{tooltipContent}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return <>{children}</>;
}

function DateResponse({ date }: { date?: string }) {
  if (!date) return null;

  const formattedDateString = formatDateWithOrdinal(new Date(date));
  return <p className="ph-no-capture my-1 font-semibold text-slate-700">{formattedDateString}</p>;
}

export default function SingleResponseCard({
  survey,
  response,
  user,
  pageType,
  environment,
  isViewer,
}: SingleResponseCardProps) {
  const environmentId = survey.environmentId;
  const displayIdentifier = response.person ? getPersonIdentifier(response.person) : null;
  const [_deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const canResponseBeDeleted = response.finished
    ? true
    : isSubmissionTimeMoreThan5Minutes(response.updatedAt);
  let skippedQuestions: string[][] = [];
  let temp: string[] = [];

  function isValidValue(value: any) {
    return (
      (typeof value === "string" && value.trim() !== "") ||
      (Array.isArray(value) && value.length > 0) ||
      typeof value === "number"
    );
  }

  if (response.finished) {
    survey.questions.forEach((question) => {
      if (!response.data[question.id]) {
        temp.push(question.id);
      } else {
        if (temp.length > 0) {
          skippedQuestions.push([...temp]);
          temp = [];
        }
      }
    });
  } else {
    for (let index = survey.questions.length - 1; index >= 0; index--) {
      const question = survey.questions[index];
      if (!response.data[question.id]) {
        if (skippedQuestions.length === 0) {
          temp.push(question.id);
        } else if (skippedQuestions.length > 0 && !isValidValue(response.data[question.id])) {
          temp.push(question.id);
        }
      } else {
        if (temp.length > 0) {
          temp.reverse();
          skippedQuestions.push([...temp]);
          temp = [];
        }
      }
    }
  }
  // Handle the case where the last entries are empty
  if (temp.length > 0) {
    skippedQuestions.push(temp);
  }

  function handleArray(data: string | number | string[]): string {
    if (Array.isArray(data)) {
      return data.join(", ");
    } else {
      return String(data);
    }
  }

  const renderTooltip = Boolean(
    (response.personAttributes && Object.keys(response.personAttributes).length > 0) ||
      (response.meta.userAgent && Object.keys(response.meta.userAgent).length > 0)
  );

  function isSubmissionTimeMoreThan5Minutes(submissionTimeISOString: Date) {
    const submissionTime: Date = new Date(submissionTimeISOString);
    const currentTime: Date = new Date();
    const timeDifference: number = (currentTime.getTime() - submissionTime.getTime()) / (1000 * 60); // Convert milliseconds to minutes
    return timeDifference > 5;
  }

  const tooltipContent = (
    <>
      {response.singleUseId && (
        <div>
          <p className="py-1 font-bold text-slate-700">SingleUse ID:</p>
          <span>{response.singleUseId}</span>
        </div>
      )}
      {response.personAttributes && Object.keys(response.personAttributes).length > 0 && (
        <div>
          <p className="py-1 font-bold text-slate-700">Person attributes:</p>
          {Object.keys(response.personAttributes).map((key) => (
            <p key={key}>
              {key}:{" "}
              <span className="font-bold">{response.personAttributes && response.personAttributes[key]}</span>
            </p>
          ))}
        </div>
      )}

      {response.meta.userAgent && Object.keys(response.meta.userAgent).length > 0 && (
        <div className="text-slate-600">
          {response.personAttributes && Object.keys(response.personAttributes).length > 0 && (
            <hr className="my-2 border-slate-200" />
          )}
          <p className="py-1 font-bold text-slate-700">Device info:</p>
          {response.meta.userAgent?.browser && <p>Browser: {response.meta.userAgent.browser}</p>}
          {response.meta.userAgent?.os && <p>OS: {response.meta.userAgent.os}</p>}
          {response.meta.userAgent && (
            <p>
              Device:{" "}
              {response.meta.userAgent.device ? response.meta.userAgent.device : "PC / Generic device"}
            </p>
          )}
          {response.meta.url && <p>URL: {response.meta.url}</p>}
          {response.meta.source && <p>Source: {response.meta.source}</p>}
          {response.meta.country && <p>Country: {response.meta.country}</p>}
        </div>
      )}
    </>
  );
  const deleteSubmissionToolTip = <>This response is in progress.</>;
  const hasHiddenFieldsEnabled = survey.hiddenFields?.enabled;
  const fieldIds = survey.hiddenFields?.fieldIds || [];
  const hasFieldIds = !!fieldIds.length;

  return (
    <div className="relative z-10 my-6 w-full rounded-lg border border-slate-200 bg-white px-6 shadow-sm">
      <div className="mt-6 flex items-center justify-between">
        <div className="flex items-center justify-center space-x-4">
          {pageType === "response" && (
            <div>
              {response.person?.id ? (
                user ? (
                  <Link
                    className="group flex items-center"
                    href={`/environments/${environmentId}/people/${response.person.id}`}>
                    <TooltipRenderer shouldRender={renderTooltip} tooltipContent={tooltipContent}>
                      <PersonAvatar personId={response.person.id} />
                    </TooltipRenderer>
                    <h3 className="ph-no-capture ml-4 pb-1 font-semibold text-slate-600 hover:underline">
                      {displayIdentifier}
                    </h3>
                  </Link>
                ) : (
                  <div className="group flex items-center">
                    <TooltipRenderer shouldRender={renderTooltip} tooltipContent={tooltipContent}>
                      <PersonAvatar personId={response.person.id} />
                    </TooltipRenderer>
                    <h3 className="ph-no-capture ml-4 pb-1 font-semibold text-slate-600">
                      {displayIdentifier}
                    </h3>
                  </div>
                )
              ) : (
                <div className="group flex items-center">
                  <PersonAvatar personId="anonymous" />
                  <h3 className="ml-4 pb-1 font-semibold text-slate-600">Anonymous</h3>
                </div>
              )}
            </div>
          )}

          {pageType === "people" && (
            <div className="flex items-center justify-center space-x-2 rounded-full bg-slate-100 p-1 px-2 text-sm text-slate-600">
              {(survey.type === "link" || environment.widgetSetupCompleted) && (
                <SurveyStatusIndicator status={survey.status} />
              )}
              <Link
                className="hover:underline"
                href={`/environments/${environmentId}/surveys/${survey.id}/summary`}>
                {survey.name}
              </Link>
            </div>
          )}
          {response.language && response.language !== "default" && (
            <div className="flex space-x-2 rounded-full bg-slate-700 px-2 py-1 text-xs text-white">
              <div>{getLanguageLabel(response.language)}</div>
              <LanguagesIcon className="h-4 w-4" />
            </div>
          )}
        </div>

        <div className="flex space-x-4 text-sm">
          <time className="text-slate-500" dateTime={timeSince(response.updatedAt.toISOString())}>
            {timeSince(response.updatedAt.toISOString())}
          </time>
          {user && !isViewer && (
            <TooltipRenderer shouldRender={!canResponseBeDeleted} tooltipContent={deleteSubmissionToolTip}>
              <TrashIcon
                onClick={() => {
                  if (canResponseBeDeleted) {
                    setDeleteDialogOpen(true);
                  }
                }}
                className={`h-4 w-4 ${
                  canResponseBeDeleted
                    ? "cursor-pointer text-slate-500 hover:text-red-700"
                    : "cursor-not-allowed text-slate-400"
                } `}
              />
            </TooltipRenderer>
          )}
        </div>
      </div>
      {/* <div className="rounded-b-lg bg-white p-6"> */}
      {/* <div className="space-y-6 p-6"> */}
      {survey.verifyEmail && response.data["verifiedEmail"] && (
        <div>
          <p className="flex items-center space-x-2 text-sm text-slate-500">
            <MailIcon className="h-4 w-4" />

            <span>Verified Email</span>
          </p>
          <p className="ph-no-capture my-1 font-semibold text-slate-700">{response.data["verifiedEmail"]}</p>
        </div>
      )}
      {survey.questions.map((question) => {
        const skipped = skippedQuestions.find((skippedQuestionElement) =>
          skippedQuestionElement.includes(question.id)
        );

        // If found, remove it from the list
        if (skipped) {
          skippedQuestions = skippedQuestions.filter((item) => item !== skipped);
        }

        return (
          <React.Fragment key={`${question.id}`}>
            {isValidValue(response.data[question.id]) ? (
              <p className="mt-6 text-sm text-slate-500">
                <span>{getLocalizedValue(question.headline, "default")}</span>
              </p>
            ) : (
              <QuestionSkip
                skippedQuestions={skipped}
                questions={survey.questions}
                status={
                  response.finished ||
                  (skippedQuestions.length > 0 &&
                    !skippedQuestions[skippedQuestions.length - 1].includes(question.id))
                    ? "skipped"
                    : "aborted"
                }
              />
            )}
            {typeof response.data[question.id] !== "object" ? (
              question.type === TSurveyQuestionType.Rating ? (
                <div>
                  <RatingResponse
                    scale={question.scale}
                    answer={response.data[question.id]}
                    range={question.range}
                  />
                </div>
              ) : question.type === TSurveyQuestionType.Date ? (
                <DateResponse date={response.data[question.id] as string} />
              ) : question.type === TSurveyQuestionType.Cal ? (
                <p className="ph-no-capture my-1 font-semibold capitalize text-slate-700">
                  {response.data[question.id]}
                </p>
              ) : (
                <p className="ph-no-capture my-1 whitespace-pre-line font-semibold text-slate-700">
                  {response.data[question.id]}
                </p>
              )
            ) : question.type === TSurveyQuestionType.PictureSelection ? (
              <PictureSelectionResponse choices={question.choices} selected={response.data[question.id]} />
            ) : question.type === TSurveyQuestionType.FileUpload ? (
              <FileUploadResponse selected={response.data[question.id]} />
            ) : (
              <p className="ph-no-capture my-1 font-semibold text-slate-700">
                {handleArray(response.data[question.id])}
              </p>
            )}
          </React.Fragment>
        );
      })}
      {/* </div> */}
      {hasHiddenFieldsEnabled && hasFieldIds && (
        <div className="mt-6 flex flex-col gap-6">
          {fieldIds.map((field) => {
            return (
              <div key={field}>
                <p className="text-sm text-slate-500">Hidden Field: {field}</p>
                <p className="ph-no-capture my-1 font-semibold text-slate-700">{response.data[field]}</p>
              </div>
            );
          })}
        </div>
      )}
      {response.finished && (
        <div className="mt-4 flex p-6">
          <CheckCircle2Icon className="h-6 w-6 text-slate-400" />
          <p className="mx-2 flex-1 rounded-lg bg-slate-100 px-2 text-slate-700">
            <span>Completed</span>
          </p>
        </div>
      )}
      {/* </div> */}
    </div>
  );
}
