"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { FaEnvelope, FaGithub } from "react-icons/fa";
import styled from "styled-components";

const FooterContainer = styled(motion.footer)`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 20vh;
  background-color: ${(props) => props.theme.colors.background};
  color: ${(props) => props.theme.colors.secondaryText};
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
`;

const FooterText = styled(motion.h2)`
  font-size: 15vw;
  font-weight: bold;
  margin: 0;
  line-height: 1;
  text-transform: uppercase;
`;

const ContactInfo = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
`;

const ContactLink = styled.a`
  color: ${(props) => props.theme.colors.primaryText};
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 5px;

  &:hover {
    color: ${(props) => props.theme.colors.accentText};
  }
`;

const Footer = () => {
  const { scrollYProgress } = useScroll();

  const yRange = useTransform(scrollYProgress, [0.9, 1], [100, 0]);
  const opacityRange = useTransform(scrollYProgress, [0.9, 1], [0, 1]);

  return (
    <FooterContainer
      style={{ opacity: opacityRange }}
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <FooterText
        style={{ y: yRange }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Footer
      </FooterText>
      <ContactInfo>
        <ContactLink href="mailto:stellayou0118@gmail.com">
          <FaEnvelope /> Email
        </ContactLink>
        <ContactLink
          href="https://github.com/youyuhsuan"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaGithub /> GitHub
        </ContactLink>
      </ContactInfo>
    </FooterContainer>
  );
};

export default Footer;
