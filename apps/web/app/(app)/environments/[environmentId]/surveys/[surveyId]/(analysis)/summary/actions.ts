"use server";

import { getEmailTemplateHtml } from "@/app/(app)/environments/[environmentId]/surveys/[surveyId]/(analysis)/summary/lib/emailTemplate";
import { customAlphabet } from "nanoid";

import { sendEmbedSurveyPreviewEmail } from "@formbricks/lib/emails/emails";
import { canUserAccessSurvey } from "@formbricks/lib/survey/auth";
import { getSurvey, updateSurvey } from "@formbricks/lib/survey/service";
import { formatSurveyDateFields } from "@formbricks/lib/survey/util";
import { getUser } from "@formbricks/lib/user/service";
import { AuthenticationError, AuthorizationError, ResourceNotFoundError } from "@formbricks/types/errors";

type TSendEmailActionArgs = {
  to: string;
  subject: string;
  html: string;
};

export const sendEmailAction = async ({ html, subject, to }: TSendEmailActionArgs) => {
  const user = await getUser("");
  const session = { user: user!, expires: "" }; //await getServerSession(authOptions);

  if (!session) {
    throw new AuthenticationError("Not authenticated");
  }
  return await sendEmbedSurveyPreviewEmail(to, subject, html);
};

export async function generateResultShareUrlAction(surveyId: string): Promise<string> {
  const user = await getUser("");
  const session = { user: user!, expires: "" }; //await getServerSession(authOptions);
  if (!session) throw new AuthorizationError("Not authorized");

  const hasUserSurveyAccess = await canUserAccessSurvey(session.user.id, surveyId);
  if (!hasUserSurveyAccess) throw new AuthorizationError("Not authorized");

  const survey = await getSurvey(surveyId);
  if (!survey?.id) {
    throw new ResourceNotFoundError("Survey", surveyId);
  }

  const resultShareKey = customAlphabet(
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
    20
  )();

  await updateSurvey({ ...formatSurveyDateFields(survey), resultShareKey });

  return resultShareKey;
}

export async function getResultShareUrlAction(surveyId: string): Promise<string | null> {
  const user = await getUser("");
  const session = { user: user!, expires: "" }; //await getServerSession(authOptions);
  if (!session) throw new AuthorizationError("Not authorized");

  const hasUserSurveyAccess = await canUserAccessSurvey(session.user.id, surveyId);
  if (!hasUserSurveyAccess) throw new AuthorizationError("Not authorized");

  const survey = await getSurvey(surveyId);
  if (!survey?.id) {
    throw new ResourceNotFoundError("Survey", surveyId);
  }

  return survey.resultShareKey;
}

export async function deleteResultShareUrlAction(surveyId: string): Promise<void> {
  const user = await getUser("");
  const session = { user: user!, expires: "" }; //await getServerSession(authOptions);
  if (!session) throw new AuthorizationError("Not authorized");

  const hasUserSurveyAccess = await canUserAccessSurvey(session.user.id, surveyId);
  if (!hasUserSurveyAccess) throw new AuthorizationError("Not authorized");

  const survey = await getSurvey(surveyId);
  if (!survey?.id) {
    throw new ResourceNotFoundError("Survey", surveyId);
  }

  await updateSurvey({ ...formatSurveyDateFields(survey), resultShareKey: null });
}

export const getEmailHtmlAction = async (surveyId: string) => {
  const user = await getUser("");
  const session = { user: user!, expires: "" }; //await getServerSession(authOptions);
  if (!session) throw new AuthorizationError("Not authorized");

  const hasUserSurveyAccess = await canUserAccessSurvey(session.user.id, surveyId);
  if (!hasUserSurveyAccess) throw new AuthorizationError("Not authorized");

  return await getEmailTemplateHtml(surveyId);
};
