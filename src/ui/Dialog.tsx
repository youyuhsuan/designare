"use client";

import React, { useRef, useEffect, ElementRef } from "react";
import styled from "styled-components";
import CloseButton from "@/src/ui/CloseButton";

interface ModalProps {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  variant?: "default" | "auth";
}

const BaseDialog = styled.dialog`
  padding: 1.25rem;
  border: none;
  box-shadow: 0 0.25rem 0.375rem ${(props) => props.theme.colors.shadow};
  &::backdrop {
    background-color: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(0.3125rem);
  }
`;

const DefaultDialog = styled(BaseDialog)`
  width: 90%;
  max-width: 600px;
  border-radius: 0.5rem;
  @media (max-width: 768px) {
    width: 95%;
    padding: 1rem;
  }
`;

const AuthDialog = styled(BaseDialog)`
  width: 100%;
  max-width: 400px;
  border-radius: 0.25rem;

  @media (max-width: 480px) {
    width: 100%;
    height: 100%;
    max-height: none;
    border-radius: 0;
  }
`;

function Dialog({
  children,
  isOpen,
  onClose,
  variant = "default",
}: ModalProps) {
  const dialogRef = useRef<ElementRef<"dialog">>(null);
  useEffect(() => {
    const dialogElement = dialogRef.current;
    if (isOpen && dialogElement && !dialogElement.open) {
      dialogElement.showModal();
    } else if (!isOpen && dialogElement && dialogElement.open) {
      dialogElement.close();
    }
  }, [isOpen]);

  let DialogComponent;
  switch (variant) {
    case "auth":
      DialogComponent = AuthDialog;
      break;
    default:
      DialogComponent = DefaultDialog;
  }

  return (
    <DialogComponent ref={dialogRef} onClose={onClose}>
      {children}
      <CloseButton onClick={onClose} />
    </DialogComponent>
  );
}

export default Dialog;
