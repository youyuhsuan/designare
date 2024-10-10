"use client";

import React from "react";
import Link from "next/link";
import styled from "styled-components";
import { FaEllipsisV } from "react-icons/fa";
import { ProjectMetadata } from "@/src/types/projectTypes";
import formatTimestamp from "@/src/utilities/timestampToDate";

const ProjectItem = styled.div<{ $viewMode: "grid" | "list" }>`
  position: relative;
  display: flex;
  flex-direction: ${(props) => (props.$viewMode === "grid" ? "column" : "row")};
  align-items: ${(props) =>
    props.$viewMode === "grid" ? "flex-start" : "center"};
  padding: ${(props) => (props.$viewMode === "grid" ? "20px" : "10px")};
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: 8px;
  transition: all 0.3s ease;

  ${(props) =>
    props.$viewMode === "grid" &&
    `
    width: 100%;
    height: 100%;
    justify-content: flex-start;
    text-align: left;
  `}

  &:hover {
    box-shadow: 0 4px 20px ${(props) => props.theme.colors.shadow};
    transform: ${(props) =>
      props.$viewMode === "grid" ? "translateY(-5px)" : "none"};
  }
`;

const IconButton = styled.button<{ $viewMode: "grid" | "list" }>`
  background: none;
  border: none;
  cursor: pointer;
  padding: 5px;
  position: ${(props) => (props.$viewMode === "grid" ? "absolute" : "static")};
  top: ${(props) => (props.$viewMode === "grid" ? "10px" : "auto")};
  right: ${(props) => (props.$viewMode === "grid" ? "10px" : "auto")};

  &:hover {
    background-color: ${(props) => props.theme.colors.hover};
    border-radius: 50%;
  }
`;

const ProjectThumbnail = styled.div<{ $viewMode: "grid" | "list" }>`
  ${(props) =>
    props.$viewMode === "grid" &&
    `  width: 100%;
`}
  width: 100px;
  height: 60px;
  background-color: #f0f0f0;
  margin-right: 15px;
`;

const ProjectInfo = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`;

const ProjectName = styled(Link)`
  font-size: 18px;
  color: ${(props) => props.theme.colors.text};
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

const LastEdited = styled.span`
  font-size: 14px;
  color: ${(props) => props.theme.colors.text};
`;

interface ProjectListItemProps {
  project: ProjectMetadata;
  viewMode: "grid" | "list";
  onMenuOpen: (event: React.MouseEvent, project: ProjectMetadata) => void;
}

const ProjectListItem: React.FC<ProjectListItemProps> = ({
  project,
  onMenuOpen,
  viewMode,
}) => {
  return (
    <ProjectItem $viewMode={viewMode}>
      <ProjectThumbnail $viewMode={viewMode} />
      <ProjectInfo>
        <ProjectName href={`/project/${project.projectId}`}>
          {project.name}
        </ProjectName>
        <LastEdited>
          最後編輯: {formatTimestamp(project.lastModified)}
        </LastEdited>
      </ProjectInfo>
      <IconButton
        $viewMode={viewMode}
        onClick={(event) => onMenuOpen(event, project)}
      >
        <FaEllipsisV />
      </IconButton>
    </ProjectItem>
  );
};

export default ProjectListItem;
