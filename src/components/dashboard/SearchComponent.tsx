import React from "react";
import styled from "styled-components";
import { FaSearch } from "react-icons/fa";

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  border-radius: 20px;
  padding: 5px 15px;
  width: 300px;
`;

const SearchInput = styled.input`
  border: none;
  background: transparent;
  margin-left: 10px;
  outline: none;
  width: 100%;
`;

interface SearchComponentProps {
  onSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
  searchTerm: string;
}

const SearchComponent: React.FC<SearchComponentProps> = ({
  onSearch,
  searchTerm,
}) => (
  <Header>
    <SearchBar>
      <FaSearch size={18} />
      <SearchInput
        placeholder="Search for anything"
        onChange={onSearch}
        value={searchTerm}
      />
    </SearchBar>
  </Header>
);

export default SearchComponent;
