import { useState, useCallback } from "react";
import {
  ProjectMetadata,
  ProjectInfo,
  ProjectDataProps,
} from "@/src/types/projectTypes";

const useProjectManagement = () => {
  const [projects, setProjects] = useState<ProjectMetadata[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAllProjects = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/projects");
      if (!response.ok) {
        throw new Error(
          `Fetch projects failed with status: ${response.status}`
        );
      }
      const data = await response.json();
      setProjects(data.projects);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "獲取資料過程中發生未知錯誤"
      );
      throw new Error(
        "Unknown error occurred while fetchAllProjects",
        error as Error
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createProject = useCallback(async (projectData: ProjectDataProps) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(projectData),
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error(
          `Create project failed with status: ${response.status}`
        );
      }
      const newProject: ProjectInfo = await response.json();
      setProjects((prev) => [...prev, newProject]);
      return newProject;
    } catch (error) {
      throw new Error(
        "Unknown error occurred while creating projects",
        error as Error
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateProjectName = useCallback(
    async (projectId: string, newName: string): Promise<string | null> => {
      try {
        const response = await fetch(`/api/projects/${projectId}/info`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ newName }),
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error(
            `Update project mame failed with status: ${response.status}`
          );
        }
        const updateProjectName: string = await response.json();
        setProjects((pre) =>
          pre.map((project) =>
            project.projectId === projectId
              ? { ...project, name: newName }
              : project
          )
        );
        setError(null);
        return newName;
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "更新專案名稱過程中發生未知錯誤"
        );
        throw new Error(
          "Unknown error occurred while createProject",
          error as Error
        );
      }
    },
    []
  );

  const deleteProject = useCallback(async (projectId: string) => {
    try {
      const response = await fetch(`/api/projects/${projectId}/info`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error(
          `Delete projects failed with status: ${response.status}`
        );
      }
      setProjects((prev) => prev.filter((p) => p.projectId !== projectId));
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "刪除專案過程中發生未知錯誤"
      );
      throw new Error(
        "Unknown error occurred while deleteProject",
        error as Error
      );
    }
  }, []);

  return {
    projects,
    isLoading,
    error,
    fetchAllProjects,
    createProject,
    updateProjectName,
    deleteProject,
  };
};

export default useProjectManagement;
