import React, { ElementRef, useEffect, useRef } from "react";
import styled from "styled-components";
import { IconType } from "react-icons";

interface MenuItemType {
  icon: IconType;
  label: string;
  onClick: () => void;
}

interface ContextMenuProps {
  isOpen: boolean;
  position: { top: number; left: number };
  items: MenuItemType[];
  onClose: () => void;
}

const MenuWrapper = styled.div<{ $top: number; $left: number }>`
  position: fixed;
  top: ${(props) => props.$top}px;
  left: ${(props) => props.$left}px;
  background-color: white;
  border: 1px solid #eaeaea;
  border-radius: 4px;
  box-shadow: 0 2px 10px ${(props) => props.theme.colors.shadow};
`;

const MenuItem = styled.div`
  padding: 10px 15px;
  display: flex;
  align-items: center;
  cursor: pointer;
  &:hover {
    background-color: #f5f5f5;
  }

  svg {
    margin-right: 10px;
  }
`;

const ContextMenu: React.FC<ContextMenuProps> = ({
  isOpen,
  position,
  items,
  onClose,
}) => {
  const menuRef = useRef<ElementRef<"div">>(null);

  useEffect(() => {
    const menuElement = menuRef.current;
    if (isOpen && menuElement) {
      menuElement.style.display = "block";
    } else if (!isOpen && menuElement) {
      menuElement.style.display = "none";
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <MenuWrapper ref={menuRef} $top={position.top} $left={position.left}>
      {items.map((item, index) => (
        <MenuItem
          key={index}
          onClick={() => {
            item.onClick();
            onClose();
          }}
        >
          <item.icon />
          {item.label}
        </MenuItem>
      ))}
    </MenuWrapper>
  );
};

export default ContextMenu;
