import React, { forwardRef } from "react";
import styled, { css } from "styled-components";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  $variant?: "filled" | "outlined" | "text";
  $color?:
    | "primary"
    | "secondary"
    | "tertiary"
    | "accent"
    | "danger"
    | "success"
    | "warning"
    | "info"
    | "light"
    | "dark";
  $size?: "small" | "medium" | "large";
  $isSelected?: boolean;
  $fullWidth?: boolean;
}

const buttonStyles = css<ButtonProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: ${(props) => props.theme.borderRadius.md};
  padding: 0.625rem 1.25rem; // 10px 20px
  cursor: pointer;
  transition: ${(props) => props.theme.transition};
  gap: 0.5rem; // 5px
  width: ${(props) => (props.$fullWidth ? "100%" : "auto")};
  // $size button styles
  ${(props) => {
    switch (props.$size) {
      case "small":
        return css`
          padding: 0.4rem 0.8rem; // 6px 12px
          font-size: 0.875rem; // 14px
        `;
      case "medium":
        return css`
          padding: 0.625rem 1.25rem; //10px 20px
          font-size: 1rem; // 16px
        `;
      case "large":
        return css`
          padding: 0.8rem 1.6rem; // 12px 24px
          font-size: 1.125rem; // 18px
        `;
    }
  }}
  // $variant button styles
  ${(props) => {
    const color = props.$color || "primary";
    switch (props.$variant) {
      case "filled":
        return css`
          background-color: ${props.theme.button.background[color]};
          color: ${props.theme.button.text[color]};
          &:hover {
            background-color: ${props.theme.button.hover[color]};
          }
        `;
      case "outlined":
        return css`
          background-color: transparent;
          border: 2px solid ${props.theme.button.outlined[color]};
          color: ${props.theme.button.text[color]};
          &:hover {
            background-color: ${props.theme.button.hover[color]};
          }
        `;
      case "text":
        return css`
          background-color: transparent;
          color: ${props.theme.button.text[color]};
          padding: 0.625rem;
          &:hover {
            background-color: ${props.theme.button.hover[color]};
          }
        `;
    }
  }}
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px ${(props) => props.theme.colors.primary}33;
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const StyledButton = styled.button<ButtonProps>`
  ${buttonStyles}
`;

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      $variant = "filled",
      $color = "primary",
      $size = "medium",
      $fullWidth = false,
      ...rest
    },
    ref
  ) => {
    return (
      <StyledButton
        $variant={$variant}
        $color={$color}
        $size={$size}
        $fullWidth={$fullWidth}
        ref={ref}
        {...rest}
      >
        {children}
      </StyledButton>
    );
  }
);

export default Button;
