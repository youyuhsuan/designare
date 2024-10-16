"use client";

import styled from "styled-components";
import EditableProjectName from "@/src/components/editor/EditableProjectName";
import useProjectManagement from "@/src/hooks/useProjectManagement";
import useProjectDetails from "@/src/hooks/useProjectDetails";
import { useParams } from "next/navigation";
import React, { useCallback, useEffect } from "react";

const Nav = styled.nav`
  display: flex;
  max-width: 74rem; // 1200px
`;

const NavWrapper = styled.div`
  width: 100%;
`;

const EditorNavbar: React.FC = () => {
  const params = useParams<{ projectId: string }>();
  const projectId = params?.projectId;
  const {
    projectDetails,
    fetchProjectInfo,
    isLoading,
    error,
    setProjectDetails,
  } = useProjectDetails(projectId as string);
  const { updateProjectName } = useProjectManagement();

  const handleRename = useCallback(
    async (newName: string) => {
      if (projectId) {
        try {
          await updateProjectName(projectId, newName);
          setProjectDetails((prevDetails) => {
            if (prevDetails) {
              return {
                ...prevDetails,
                info: { ...prevDetails.info, name: newName },
              };
            }
            return null;
          });
          await fetchProjectInfo();
        } catch (error) {
          console.error("Error during handle rename", error);
        }
      }
    },
    [projectId, updateProjectName, setProjectDetails, fetchProjectInfo]
  );

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Nav>
      <NavWrapper>
        <EditableProjectName
          name={projectDetails?.info.name as string}
          onRename={handleRename}
        ></EditableProjectName>
      </NavWrapper>
    </Nav>
  );
};

export default EditorNavbar;
