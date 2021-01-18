import * as React from "react";
import { useState } from "react";
import styled from "styled-components";
import { useHistory, Link } from "react-router-dom";

import ToggleButton from "./ToggleButton";
import { NavigationItem } from "./NavigationItem";
import { useMeQuery } from "#root/generated/graphql";
import AccessIbility from "./AccessIbility";

interface NavbarProps {}

const MainNavigationLogoLink = styled(Link)`
  display: flex;
  height: 100%;
  margin: 0 2rem 0 2rem;
  transition: opacity 0.2s ease;
  text-decoration: none;

  > h1 {
    margin: auto;
    letter-spacing: 0.2rem;
    font-weight: 500;
    color: ${({ theme }) => theme.fontColor};
  }

  :hover {
    cursor: pointer;
    opacity: 0.6;
  }
`;

const MainNavigation = styled.nav`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  background-color: ${({ theme }) => theme.navbarColor};
  box-shadow: 0 1px 3px rgba(15, 15, 15, 0.13);
  flex-flow: row nowrap;
  -webkit-font-smoothing: antialiased;
  height: 56px;

  @media (max-width: 1000px) {
    padding: 0 2rem;
  }
  @media (max-width: 768px) {
    justify-content: space-between;
  }
`;

const MainNavigationLinks = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
`;

const NavigationItems = styled.div<{ toggle: boolean }>`
  display: flex;
  justify-content: flex-start;
  flex: 1;
  height: 100%;
  align-items: center;

  @media (max-width: 768px) {
    padding: 2rem;
    position: absolute;
    right: 0px;
    height: ${window.innerHeight - 56}px;
    top: 56px;
    display: block;
    width: 60%;
    transform: ${(p) => (p.toggle ? "translateX(0%)" : "translateX(100%)")};
    background: ${({ theme }) => theme.navbarColor};

    backdrop-filter: blur(10px);
    transition: transform 0.5s ease-in;
    z-index: 20;
    font-size: 1.3rem;

    ${MainNavigationLinks} {
      height: fit-content;
      display: flex;
      flex-direction: column;
      > * {
        margin: 1.5rem 0 1.5rem 0;
      }
    }
  }
`;

export const Navbar: React.FC<NavbarProps> = ({}) => {
  let history = useHistory();
  const { data, loading } = useMeQuery();

  const [toggleNav, setToggleNav] = useState<boolean>(false);

  const condition = !loading && data && data.me;

  return (
    <MainNavigation>
      <MainNavigationLogoLink to="/">
        <h1>ImgProject</h1>
      </MainNavigationLogoLink>
      <NavigationItems toggle={toggleNav}>
        <MainNavigationLinks>
          <NavigationItem
            closeNav={() => setToggleNav(false)}
            to="/"
            label="Home"
          />
          {condition && (
            <NavigationItem
              closeNav={() => setToggleNav(false)}
              to="/images"
              label="Images"
            />
          )}
        </MainNavigationLinks>
        <AccessIbility closeNav={() => setToggleNav(false)} />
      </NavigationItems>
      <ToggleButton
        isOpen={toggleNav}
        toggle={() => setToggleNav((prev) => !prev)}
      />
    </MainNavigation>
  );
};
