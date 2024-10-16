"use client";

import React, { useState } from "react";
import styled from "styled-components";
import { FaChevronRight } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import useAsset from "@/src/hooks/useAsset";
import AssetDetails from "@/src/components/editor/AssetDetails";
import Tooltip from "@/src/components/editor/Tooltip";

interface SubItem {
  text: string;
  link?: string;
}

interface NavItem {
  icon: React.ReactNode;
  text: string;
  subItems?: SubItem[];
}

const SidebarContainer = styled(motion.div)`
  position: fixed;
  left: 0;
  height: 100dvh;
  background-color: ${(props) => props.theme.colors.background};
`;

const NavItem = styled(motion.div)`
  position: relative;
`;

const NavItemHeader = styled(motion.div)`
  display: flex;
  align-items: center;
  padding: 10px;
  cursor: pointer;
`;

const NavIcon = styled.div`
  margin-right: 10px;
`;

const ChevronIcon = styled(motion.div)`
  margin-left: auto;
`;

const ExpandedContent = styled(motion.div)`
  position: absolute;
  left: 100%;
  top: 0;
  background-color: #ffffff;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  z-index: 1;
`;

const CollapseSidebar: React.FC = () => {
  const { allAssets, isLoadingAllAssets, allAssetsError } = useAsset();
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

  const toggleItem = (id: string) => {
    setOpenItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  if (isLoadingAllAssets) return <div>Loading assets...</div>;
  if (allAssetsError)
    return <div>Error loading assets: {allAssetsError.message}</div>;

  // Animation
  const sidebarVariants = {
    open: { width: 250, transition: { duration: 0.3 } },
    closed: { width: 60, transition: { duration: 0.3 } },
  };

  const expandedContentVariants = {
    open: { width: 250, opacity: 1, transition: { duration: 0.3 } },
    closed: { width: 0, opacity: 0, transition: { duration: 0.3 } },
  };

  const chevronVariants = {
    open: { rotate: 0 },
    closed: { rotate: -90 },
  };
  return (
    <SidebarContainer initial="close" animate="open" variants={sidebarVariants}>
      {allAssets.map((item) => (
        <NavItem key={item.id} whileHover={{ backgroundColor: "#e0e0e0" }}>
          <NavItemHeader onClick={() => toggleItem(item.id)}>
            <NavIcon>{item.icon}</NavIcon>
            <Tooltip content={item.name} position="right">
              {item.name}
            </Tooltip>
            <ChevronIcon
              animate={openItems[item.id] ? "open" : "closed"}
              variants={chevronVariants}
            >
              <FaChevronRight />
            </ChevronIcon>
          </NavItemHeader>
          <AnimatePresence>
            {openItems[item.id] && (
              <ExpandedContent
                initial="closed"
                animate="open"
                exit="closed"
                variants={expandedContentVariants}
              >
                <AssetDetails
                  expandedContentVariants={expandedContentVariants}
                  assetName={item.name}
                />
              </ExpandedContent>
            )}
          </AnimatePresence>
        </NavItem>
      ))}
    </SidebarContainer>
  );
};

export default CollapseSidebar;
