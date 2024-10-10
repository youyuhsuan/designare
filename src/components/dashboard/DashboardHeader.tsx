"use client";

import React from "react";
import styled from "styled-components";
import CreateProjectButton from "@/src/components/dashboard/CreateProjectButton";

const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  border-bottom: 1px solid ${(props) => props.theme.colors.border};
`;

const Title = styled.h1`
  font-size: 1.25rem;
  font-weight: 500;
  color: ${(props) => props.theme.colors.primaryText};
`;

const ActionContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const FeedbackIcon = styled.img`
  width: 1.5rem;
  height: 1.5rem;
  cursor: pointer;
  margin-left: 0.5rem;
`;

const DashboardHeader = () => {
  return (
    <HeaderContainer>
      <Title>Recents</Title>
      <ActionContainer>
        <CreateProjectButton />
      </ActionContainer>
    </HeaderContainer>
  );
};

export default DashboardHeader;
