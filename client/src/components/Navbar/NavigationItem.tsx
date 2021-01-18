import * as React from "react";

import styled from "styled-components";
import { Link } from "react-router-dom";

interface NavigationItemProps {
  to: string;
  label: string;
  closeNav: () => void;
}

const MainNavigationItem = styled.div`
  display: flex;
  height: 100%;
  padding: 0 1.1rem;
  color: ${({ theme }) => theme.fontColor};
  font-weight: 400;
  font-size: 14px;
  align-items: center;
  justify-content: center;
  border-top: 2px solid transparent;
  transition: all 0.22s ease-in-out;

  &:hover {
    border-top: 2px solid #2ecc71;
  }

  @media (max-width: 768px) {
    &:hover {
      border-top: 2px solid transparent;
    }
  }
`;

const MainNavigationLink = styled(Link)`
  text-decoration: none;
  color: inherit;
  font-size: 1.2rem;
`;

export const NavigationItem: React.FC<NavigationItemProps> = ({
  label,
  to,
  closeNav,
}) => {
  return (
    <MainNavigationItem>
      <MainNavigationLink onClick={closeNav} to={to}>
        {label}
      </MainNavigationLink>
    </MainNavigationItem>
  );
};
