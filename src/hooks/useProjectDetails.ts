import { ProjectInfo } from "@/src/types/projectTypes";
import { useQueries } from "@tanstack/react-query";

// API
const fetchProjectInfo = async (projectId: string): Promise<ProjectInfo> => {
  const response = await fetch(`/api/projects/${projectId}/info`);
  if (!response.ok) {
    throw new Error(
      `Fetch project info failed with status: ${response.status}`
    );
  }
  return response.json();
};

const fetchProjectPage = async (projectId: string): Promise<ProjectInfo> => {
  const response = await fetch(`/api/projects/${projectId}/page`);
  if (!response.ok) {
    throw new Error(
      `Fetch project page failed with status: ${response.status}`
    );
  }
  return response.json();
};

const useProjectDetails = (projectId: string) => {
  const results = useQueries({
    queries: [
      {
        queryKey: ["projectInfo", projectId],
        queryFn: () => fetchProjectInfo(projectId),
        enabled: !!projectId,
      },
      {
        queryKey: ["projectPage", projectId],
        queryFn: () => fetchProjectPage(projectId),
        enabled: !!projectId,
      },
    ],
  });

  const [projectInfo, projectPage] = results;

  const isLoading = results.some((result) => result.isLoading);
  const isError = results.some((result) => result.isError);
  const error = results.find((result) => result.error)?.error;

  return {
    projectInfo: projectInfo.data,
    projectPage: projectPage.data,
    isLoading,
    isError,
    error,
  };
};

export default useProjectDetails;
