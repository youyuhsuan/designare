import React from "react";
import useProjectManagement from "@/src/hooks/useProjectManagement";

const useDashboard = () => {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [viewMode, setViewMode] = React.useState<"grid" | "list">("grid");
  const {
    projects,
    isLoading,
    error,
    fetchAllProjects,
    updateProjectName,
    deleteProject,
  } = useProjectManagement();

  React.useEffect(() => {
    fetchAllProjects();
  }, [fetchAllProjects]);

  const filteredProjects = React.useMemo(() => {
    if (!Array.isArray(projects)) return [];
    return projects.filter((project) =>
      project.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [projects, searchTerm]);

  const handleSearch = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(e.target.value);
    },
    []
  );

  const handleDelete = React.useCallback(
    async (projectId: string) => {
      try {
        await deleteProject(projectId);
        await fetchAllProjects();
      } catch (error) {
        console.error("Error during deletion and fetching", error as Error);
      }
    },
    [deleteProject, fetchAllProjects]
  );

  const handleRename = React.useCallback(
    async (projectId: string, newName: string) => {
      try {
        await updateProjectName(projectId, newName);
      } catch (error) {
        console.error("Error during handle rename", error as Error);
      }
    },
    [deleteProject, fetchAllProjects]
  );

  const handleViewToggle = React.useCallback((view: "grid" | "list") => {
    setViewMode(view);
  }, []);

  return {
    searchTerm,
    viewMode,
    filteredProjects,
    isLoading,
    error,
    handleSearch,
    handleDelete,
    handleRename,
    handleViewToggle,
  };
};

export default useDashboard;
