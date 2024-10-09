"use client";

import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import avatar from "@/public/images/avatar.png";
import Link from "next/link";

interface UserMenuProps {
  username: string;
  email: string;
  avatarUrl?: string;
  handleLogout: () => void;
}

const UserMenuContainer = styled.div`
  position: relative;
`;

const UserMenuButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 0;
`;

const UserAvatarContainer = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
`;

const AvatarImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  border-radius: 0.5rem; // 8px
  box-shadow: 0 2px 10px ${(props) => props.theme.colors.shadow};
  padding: 1rem;
  min-width: 200px;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  text-align: center;
  margin-bottom: 1rem;
`;

const Username = styled.p<{ $username?: string }>`
  margin: 8px 0 4px;
  font-size: 18px;
  color: ${(props) => props.theme.colors.primaryText};
`;

const UserEmail = styled.p<{ $email?: string }>`
  margin: 0;
  font-size: 14px;
  color: ${(props) => props.theme.colors.primaryText};
`;

const MenuItem = styled(Link)`
  padding: 8px 0;
  cursor: pointer;
  color: ${(props) => props.theme.colors.text};
  display: flex;
  align-items: center;

  &:hover {
    color: ${(props) => props.theme.colors.accent};
  }

  svg {
    margin-right: 8px;
  }
`;

const MenuItemDiv = styled.div`
  padding: 8px 0;
  cursor: pointer;
  color: ${(props) => props.theme.colors.text};
  display: flex;
  align-items: center;
  &:hover {
    color: ${(props) => props.theme.colors.accent};
  }
  svg {
    margin-right: 8px;
  }
`;
const UserMenu: React.FC<UserMenuProps> = ({
  username,
  email,
  avatarUrl,
  handleLogout,
}) => {
  const avatarSrc = avatarUrl || avatar.src;
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <UserMenuContainer ref={dropdownRef}>
      <UserMenuButton onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
        <UserAvatarContainer>
          <AvatarImage src={avatarSrc} alt={username || "User avatar"} />
        </UserAvatarContainer>{" "}
      </UserMenuButton>
      {isDropdownOpen && (
        <DropdownMenu>
          <UserInfo>
            <UserAvatarContainer>
              <AvatarImage src={avatarSrc} alt={username || "User avatar"} />
            </UserAvatarContainer>{" "}
            <Username>{username}</Username>
            <UserEmail>{email}</UserEmail>
          </UserInfo>
          <MenuItem href="/dashboard">
            {/* //TODO:這邊還要處理 */}
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"
                fill="currentColor"
              />
            </svg>
            Dashboard
          </MenuItem>
          <MenuItemDiv onClick={handleLogout}>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"
                fill="currentColor"
              />
            </svg>
            Sign out
          </MenuItemDiv>
        </DropdownMenu>
      )}
    </UserMenuContainer>
  );
};

export default UserMenu;
