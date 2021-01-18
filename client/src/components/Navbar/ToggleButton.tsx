import * as React from "react";
import styled from "styled-components";

interface ToggleButtonProps {
  isOpen: boolean;
  toggle: () => void;
}

const Line1 = styled.div``;
const Line2 = styled.div``;
const Line3 = styled.div``;

const Burger = styled.div<{ isOpen: boolean }>`
  display: none;
  cursor: pointer;

  > div {
    width: 25px;
    height: 3px;
    background-color: ${({ theme }) => theme.fontColor};
    margin: 5px;
    border-radius: 3px;
    transition: all 0.3s ease;
  }
  @media (max-width: 768px) {
    display: block;
  }

  ${Line1} {
    transform: ${(p) =>
      p.isOpen ? "rotate(-45deg) translate(-5px, 6px)" : "none"};
  }
  ${Line2} {
    opacity: ${(p) => (p.isOpen ? "0" : "1")};
  }
  ${Line3} {
    transform: ${(p) =>
      p.isOpen ? "rotate(45deg) translate(-5px, -6px)" : "none"};
  }
`;

const ToggleButton: React.FC<ToggleButtonProps> = ({ isOpen, toggle }) => {
  return (
    <Burger isOpen={isOpen} onClick={toggle}>
      <Line1 />
      <Line2 />
      <Line3 />
    </Burger>
  );
};
export default ToggleButton;
