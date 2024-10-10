import React from "react";
import styled from "styled-components";
import { FaTh, FaList } from "react-icons/fa";

const ToggleWrapper = styled.div`
  display: flex;
`;

const IconButton = styled.button<{ $isActive: boolean }>`
  background: none;
  border: none;
  cursor: pointer;
  padding: 1rem;
  color: ${(props) =>
    props.$isActive ? props.theme.colors.primary : props.theme.colors.primary};

  &:hover {
    color: ${(props) => props.theme.colors.accent};
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px ${(props) => props.theme.colors.accent};
  }
`;

interface ViewModeToggleProps {
  viewMode: "grid" | "list";
  onToggle: (mode: "grid" | "list") => void;
}

const ViewModeToggle: React.FC<ViewModeToggleProps> = ({
  viewMode,
  onToggle,
}) => {
  return (
    <ToggleWrapper>
      <IconButton
        onClick={() => onToggle("grid")}
        $isActive={viewMode === "grid"}
        aria-label="Switch to grid view"
      >
        <FaTh size={18} />
      </IconButton>
      <IconButton
        onClick={() => onToggle("list")}
        $isActive={viewMode === "list"}
        aria-label="Switch to list view"
      >
        <FaList size={18} />
      </IconButton>
    </ToggleWrapper>
  );
};

export default ViewModeToggle;
