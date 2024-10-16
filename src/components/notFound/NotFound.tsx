"use client";

import styled from "styled-components";
import Link from "next/link";

const Content = styled.div`
  text-align: center;
`;

const Title = styled.h1`
  font-size: 9rem;
  font-weight: bold;
  margin-bottom: 1rem;
`;

const Subtitle = styled.h2`
  font-size: 2.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const Message = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 1rem;
`;

const Description = styled.p`
  color: #4b5563;
  margin-bottom: 2rem;
`;

const StyledLink = styled(Link)`
  background-color: #d8b4fe;
  color: #5b21b6;
  padding: 0.75rem 1.5rem;
  border-radius: 9999px;
  font-size: 1.125rem;
  font-weight: 600;
  transition: background-color 0.3s;

  &:hover {
    background-color: #c084fc;
  }
`;

const NotFoundComponent = () => {
  return (
    <>
      <Content>
        <Title>404</Title>
        <Subtitle>糟糕！</Subtitle>
        <Message>找不到頁面</Message>
        <Description>
          此頁面不存在或已被移除！
          <br />
          我們建議您返回首頁
        </Description>
        <StyledLink href="/">返回首頁</StyledLink>
      </Content>
    </>
  );
};

export default NotFoundComponent;
