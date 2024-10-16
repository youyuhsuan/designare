"use client";

import React from "react";
import styled from "styled-components";
import { motion, AnimatePresence, Variants } from "framer-motion";

interface TooltipProps {
  children: React.ReactNode;
  content: React.ReactNode;
  position?: "top" | "bottom" | "left" | "right";
  $showOnFocus?: boolean;
  $styleMe?: boolean;
}

const TooltipWrapper = styled.div`
  position: relative;
  display: inline-flex;
`;

const TooltipTarget = styled.button<{
  $showOnFocus: boolean;
  $styleMe: boolean;
}>`
  border: none;
  background: inherit;
  padding: 5px;
  margin: -1px;
  font-size: inherit;
  color: inherit;
  cursor: inherit;
  display: flex;
  ${({ $showOnFocus }) => !$showOnFocus && `outline: none;`}
  ${({ $styleMe }) =>
    $styleMe &&
    `
    padding: 15px;
    margin: 1px;
    border: 1px solid gray;
    border-radius: 5px;
    font-size: 2rem;
  `}
`;

const TooltipBox = styled(motion.div)<{ $position: string }>`
  background-color: ${(props) => props.theme.colors};
  position: absolute;
  color: ${(props) => props.theme.colors.primary};
  text-align: center;
  border-radius: 5px;
  padding: 10px 8px;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.15), 0 4px 8px rgba(0, 0, 0, 0.2);
  pointer-events: none;
  width: max-content;
  max-width: 200px;

  &:after {
    content: "";
    position: absolute;
    border: 8px solid transparent;
  }

  ${({ $position, theme }) => {
    switch ($position) {
      case "top":
        return `
          &:after {
            top: 100%;
            left: 50%;
            transform: translateX(-50%);
            border-top-color: ${theme.colors.background};
          }
        `;
      case "bottom":
        return `
          &:after {
            bottom: 100%;
            left: 50%;
            transform: translateX(-50%);
            border-bottom-color: ${theme.colors.background};
          }
        `;
      case "left":
        return `
          &:after {
            left: 100%;
            top: 50%;
            transform: translateY(-50%);
            border-left-color:  ${theme.colors.background};
          }
        `;
      case "right":
        return `
          &:after {
            right: 100%;
            top: 50%;
            transform: translateY(-50%);
            border-right-color:  ${theme.colors.background};
          }
        `;
      default:
        return "";
    }
  }}
`;

const tooltipVariants: Variants = {
  initial: {
    opacity: 0,
    scale: 0.9,
  },
  animate: (position: string) => {
    const baseStyles = {
      opacity: 1,
      scale: 1,
    };
    switch (position) {
      case "top":
        return {
          ...baseStyles,
          bottom: "calc(100% + 13px)",
          left: "50%",
          x: "-50%",
        };
      case "bottom":
        return {
          ...baseStyles,
          top: "calc(100% + 13px)",
          left: "50%",
          x: "-50%",
        };
      case "left":
        return {
          ...baseStyles,
          right: "calc(100% + 13px)",
          top: "50%",
          y: "-50%",
        };
      case "right":
        return {
          ...baseStyles,
          left: "calc(100% + 13px)",
          top: "50%",
          y: "-50%",
        };
      default:
        return baseStyles;
    }
  },
  exit: {
    opacity: 0,
    scale: 0.9,
  },
};

const Tooltip: React.FC<TooltipProps> = ({
  children,
  content,
  position = "top",
  $showOnFocus = true,
  $styleMe = false,
}) => {
  const [isVisible, setIsVisible] = React.useState(false);

  return (
    <TooltipWrapper
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => $showOnFocus && setIsVisible(true)}
      onBlur={() => $showOnFocus && setIsVisible(false)}
    >
      <TooltipTarget $showOnFocus={$showOnFocus} $styleMe={$styleMe}>
        {children}
      </TooltipTarget>
      <AnimatePresence>
        {isVisible && (
          <TooltipBox
            $position={position}
            variants={tooltipVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            custom={position}
          >
            {content}
          </TooltipBox>
        )}
      </AnimatePresence>
    </TooltipWrapper>
  );
};

export default Tooltip;
