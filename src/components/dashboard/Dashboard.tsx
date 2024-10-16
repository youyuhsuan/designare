"use client";

import React from "react";
import useDashboardState from "@/src/hooks/useDashboardState";
import SearchComponent from "@/src/components/dashboard/SearchComponent";
import ProjectsView from "@/src/components/dashboard/ProjectsView";
import ViewModeToggle from "@/src/components/dashboard/ViewModeToggle";

const Dashboard: React.FC = () => {
  const {
    searchTerm,
    viewMode,
    filteredProjects,
    isLoading,
    error,
    handleSearch,
    handleDelete,
    handleViewToggle,
    handleRename,
  } = useDashboardState();

  return (
    <>
      <SearchComponent searchTerm={searchTerm} onSearch={handleSearch} />
      <ViewModeToggle viewMode={viewMode} onToggle={handleViewToggle} />
      <ProjectsView
        projects={filteredProjects}
        viewMode={viewMode}
        isLoading={isLoading}
        error={error}
        onDelete={handleDelete}
        onRename={handleRename}
      />
    </>
  );
};

export default Dashboard;
