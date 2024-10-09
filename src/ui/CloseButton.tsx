import React, { useRef, useEffect, ElementRef } from "react";
import styled from "styled-components";

const CloseButtonStyled = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 5px;
  color: #666;
  transition: color 0.2s ease;

  &:hover {
    color: #000;
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

interface CloseButtonProps {
  onClick: () => void;
}

const CloseButton: React.FC<CloseButtonProps> = ({ onClick }) => (
  <CloseButtonStyled
    role="button"
    aria-label="Close"
    type="button"
    data-focus-visible="true"
    onClick={onClick}
  >
    <CloseIcon />
  </CloseButtonStyled>
);

const CloseIcon = () => (
  <svg
    aria-hidden="true"
    fill="none"
    focusable="false"
    role="presentation"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    viewBox="0 0 16 16"
    width="1em"
    height="1em"
  >
    <path d="M12 4L4 12M4 4l8 8"></path>
  </svg>
);

export default CloseButton;
