import { ProjectDetails, ProjectInfo } from "@/src/types/projectTypes";
import { useCallback, useEffect, useState } from "react";

const useProjectDetails = (projectId: string) => {
  const [projectDetails, setProjectDetails] = useState<ProjectDetails | null>(
    null
  );
  const [projectInfo, setProjectInfo] = useState<ProjectInfo | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Project info and data
  const fetchProjectDetails = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [infoResponse, pageResponse] = await Promise.all([
        fetch(`/api/projects/${projectId}/info`),
        fetch(`/api/projects/${projectId}/page`),
      ]);
      if (!infoResponse.ok) {
        throw new Error(
          `Fetch project info failed with status: ${infoResponse.status}`
        );
      }
      if (!pageResponse.ok) {
        throw new Error(
          `Fetch project page failed with status: ${pageResponse.status}`
        );
      }
      const [info, page] = await Promise.all([
        infoResponse.json(),
        pageResponse.json(),
      ]);

      setProjectDetails({ info, page });
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  // fetch project info
  const fetchProjectInfo = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/projects/${projectId}/info`);
      if (!response.ok) {
        throw new Error(
          `Fetch project info failed with status: ${response.status}`
        );
      }
      const info: ProjectInfo = await response.json();
      setProjectInfo(info);
      return info;
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "獲取專案資訊時發生錯誤"
      );
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchProjectDetails();
  }, []);

  return {
    projectDetails,
    projectInfo,
    isLoading,
    error,
    setProjectDetails,
    fetchProjectInfo,
    fetchProjectDetails,
  };
};

export default useProjectDetails;
