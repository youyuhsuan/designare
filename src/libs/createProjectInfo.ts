import { v4 as uuidv4 } from "uuid";
import {
  ProjectInfo,
  ProjectStatus,
  ProjectType,
  ProjectUrlOptions,
  SerializedTimestamp,
} from "@/src/types/projectTypes";

function createProjectInfo(
  userId: string,
  name: string,
  type: ProjectType,
  status: ProjectStatus = "active",
  parentTemplateId?: string,
  screenshotUrl: string = "",
  urlOptions: ProjectUrlOptions = {}
): ProjectInfo {
  const now = new Date();
  const serializedNow: SerializedTimestamp = {
    seconds: Math.floor(now.getTime() / 1000),
    nanoseconds: (now.getTime() % 1000) * 1e6,
  };
  const projectId = uuidv4();
  return {
    projectId: projectId,
    userId,
    name,
    type,
    status,
    parentTemplateId,
    screenshotUrl,
    url:
      urlOptions.customUrl ||
      `${process.env.DESIGNARE_URL}/projects/${uuidv4()}`,
    thumbnailUrl:
      urlOptions.customThumbnailUrl ||
      `${process.env.DESIGNARE_URL}/api/thumbnail?url=${encodeURIComponent(
        screenshotUrl
      )}` ||
      undefined,
    lastModified: serializedNow,
    createdAt: serializedNow,
  };
}

export default createProjectInfo;
