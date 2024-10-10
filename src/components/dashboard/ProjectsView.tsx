"use client";

import React, { useCallback, useEffect, useState } from "react";
import { ProjectMetadata } from "@/src/types/projectTypes";
import styled from "styled-components";
import ContextMenu from "@/src/components/dashboard/ContextMenu";
import ProjectListItem from "@/src/components/dashboard/ProjectListItem";
import {
  EditDialog,
  DeleteDialog,
} from "@/src/components/dashboard/DashboardDialog";
import { FaEdit, FaTrash } from "react-icons/fa";

interface ProjectsViewProps {
  projects: ProjectMetadata[];
  isLoading: boolean;
  error: string | null;
  viewMode: "grid" | "list";
  onDelete: (projectId: string) => Promise<void>;
  onRename: (projectId: string, newName: string) => Promise<void>;
}

const NoProjectContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const NoProjectText = styled.p`
  font-size: 1.125rem;
  line-height: 1.75rem;
`;

const Loading = styled.div`
  padding: 2rem;
`;

const ErrorMessage = styled.span`
  color: ${(props) => props.theme.colors.danger};
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
`;

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const ProjectsView: React.FC<ProjectsViewProps> = React.memo(
  ({ projects, isLoading, error, onDelete, onRename, viewMode }) => {
    const [activeProject, setActiveProject] = useState<ProjectMetadata | null>(
      null
    );
    const [contextMenuPosition, setContextMenuPosition] = useState({
      top: 0,
      left: 0,
    });
    const [isContextMenuOpen, setIsContextMenuOpen] = useState(false);
    const [dialogType, setDialogType] = useState<"edit" | "delete" | null>(
      null
    );
    const [editName, setEditName] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [deleteInputValue, setDeleteInputValue] = useState("");
    const [isDeleteEnabled, setIsDeleteEnabled] = useState(false);

    const handleContextMenuOpen = useCallback(
      (event: React.MouseEvent, project: ProjectMetadata) => {
        event.preventDefault();
        setActiveProject(project);
        setContextMenuPosition({ top: event.clientY, left: event.clientX });
        setIsContextMenuOpen(true);
      },
      []
    );

    const handleMenuClose = useCallback(() => {
      setIsContextMenuOpen(false);
    }, []);

    const handleEditClick = useCallback(() => {
      if (activeProject) {
        setEditName(activeProject.name);
        setDialogType("edit");
        handleMenuClose();
      }
    }, [activeProject, handleMenuClose]);

    const handleDeleteClick = useCallback(() => {
      setDialogType("delete");
      handleMenuClose();
    }, [handleMenuClose]);

    const handleDialogClose = useCallback(() => {
      setDialogType(null);
    }, []);

    const handleSave = useCallback(async () => {
      if (!activeProject) return;
      setIsSaving(true);
      try {
        await onRename(activeProject.projectId, editName);
        handleDialogClose();
      } catch (error) {
        console.error("Failed to update project name:", error);
      } finally {
        setIsSaving(false);
      }
    }, [activeProject, editName, onRename, handleDialogClose]);

    useEffect(() => {
      setIsDeleteEnabled(deleteInputValue === activeProject?.name);
    }, [deleteInputValue, activeProject]);

    const handleDelete = useCallback(async () => {
      if (!activeProject || !isDeleteEnabled) return;
      try {
        await onDelete(activeProject.projectId);
        handleDialogClose();
      } catch (error) {
        console.error("Failed to delete project:", error);
      }
    }, [activeProject, isDeleteEnabled, onDelete, handleDialogClose]);

    const menuItems = [
      { icon: FaEdit, label: "重新命名", onClick: handleEditClick },
      { icon: FaTrash, label: "刪除設計", onClick: handleDeleteClick },
    ];

    if (isLoading) return <Loading>Loading...</Loading>;
    if (error) return <ErrorMessage>{error}</ErrorMessage>;

    const Container = viewMode === "grid" ? GridContainer : ListContainer;

    if (projects.length === 0) {
      return (
        <NoProjectContainer>
          <NoProjectText>
            目前還沒有專案。開始創建您的第一個專案吧！
          </NoProjectText>
        </NoProjectContainer>
      );
    }

    return (
      <>
        <Container>
          {projects.map((project) => (
            <ProjectListItem
              key={project.projectId}
              project={project}
              onMenuOpen={handleContextMenuOpen}
              viewMode={viewMode}
            />
          ))}
        </Container>
        <ContextMenu
          isOpen={isContextMenuOpen}
          position={contextMenuPosition}
          items={menuItems}
          onClose={handleMenuClose}
        />
        <EditDialog
          isOpen={dialogType === "edit"}
          onClose={handleDialogClose}
          projectName={activeProject?.name || ""}
          editName={editName}
          setEditName={setEditName}
          onSave={handleSave}
          isSaving={isSaving}
        />
        <DeleteDialog
          isOpen={dialogType === "delete"}
          onClose={handleDialogClose}
          projectName={activeProject?.name || ""}
          onDelete={handleDelete}
          inputValue={deleteInputValue}
          setInputValue={setDeleteInputValue}
          isDeleteEnabled={isDeleteEnabled}
        />
      </>
    );
  }
);

export default ProjectsView;
