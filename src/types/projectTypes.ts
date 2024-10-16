interface SerializedTimestamp {
  seconds: number;
  nanoseconds: number;
}

type ProjectType = "blank" | "template";
type ProjectStatus = "active" | "archived" | "deleted" | "published";

interface ProjectMetadata {
  projectId: string;
  name: string;
  screenshotUrl: string;
  lastModified: SerializedTimestamp;
  createdAt: SerializedTimestamp;
}

interface ProjectInfo extends ProjectMetadata {
  userId: string;
  thumbnailUrl?: string;
  url: string;
  type: ProjectType;
  parentTemplateId?: string;
  status: ProjectStatus;
}

interface ProjectUrlOptions {
  customUrl?: string;
  customThumbnailUrl?: string;
}

// create Project in useProct.ts
interface ProjectDataProps
  extends Omit<ProjectMetadata, "projectId" | "lastModified" | "createdAt"> {
  userId: string;
  type: ProjectType;
  parentTemplateId?: string;
}

// CreateProjectButton.ts
// handleClick
interface CreateProjectInfoProps {
  name: string;
  type: ProjectType;
  status: ProjectStatus;
  parentTemplateId?: string;
  screenshotUrl: string;
}

// CreateProjectButton
interface CreateProjectButtonProps {
  type?: ProjectType;
  initialName?: string;
  buttonText?: string;
  screenshotUrl?: string;
}

// ProjectInfoConverter
interface ProjectInfoConverter
  extends Omit<ProjectMetadata, "lastModified" | "createdAt"> {}

// Promise.all
interface ProjectDetails {
  info: ProjectInfo;
  page?: any | null;
}

export type {
  SerializedTimestamp,
  ProjectType,
  ProjectStatus,
  ProjectMetadata,
  ProjectInfo,
  ProjectDataProps,
  ProjectUrlOptions,
  CreateProjectInfoProps,
  CreateProjectButtonProps,
  ProjectInfoConverter,
  ProjectDetails,
};
