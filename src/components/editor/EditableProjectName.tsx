"use client";

import styled from "styled-components";
import React, { useState } from "react";
import Button from "@/src/ui/Button";
import { FaEdit, FaCheck, FaTimes } from "react-icons/fa";

interface EditableProjectNameProps {
  name: string;
  onRename: (newName: string) => Promise<void>;
}

const EditableWrapper = styled.div`
  display: flex;
`;

const ProjectName = styled.h1`
  margin-right: 10px;
`;

const Input = styled.input`
  font-size: 1em;
  padding: 5px;
  margin-right: 10px;
`;

const EditableProjectName: React.FC<EditableProjectNameProps> = ({
  name,
  onRename,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState<string | null>(null);

  const handleRename = () => {
    if (newName && newName !== name) {
      onRename(newName);
    }
    setIsEditing(false);
  };

  const handleClose = () => {
    setNewName(name);
    setIsEditing(false);
  };

  const handleEditing = () => {
    setIsEditing(true);
    setNewName(name);
  };

  return (
    <EditableWrapper>
      {isEditing ? (
        <>
          <Input
            value={newName as string}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleRename()}
          ></Input>
          <Button $variant="text" onClick={handleRename}>
            <FaCheck />
          </Button>
          <Button $variant="text" onClick={handleClose}>
            <FaTimes />
          </Button>
        </>
      ) : (
        <>
          <ProjectName>{name}</ProjectName>
          <Button $variant="text" onClick={handleEditing}>
            <FaEdit />
          </Button>
        </>
      )}
    </EditableWrapper>
  );
};

export default EditableProjectName;
