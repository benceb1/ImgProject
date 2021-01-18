import * as React from "react";
import styled from "styled-components";

interface FooterProps {}

const Wrapper = styled.footer`
  margin: 0 10rem;
  font-size: 1rem;
  @media (max-width: 768px) {
    display: flex;
    justify-content: center;
    margin: 0 1rem;
  }
`;

const Text = styled.p`
  margin: 2.5rem 0;
`;

const Footer: React.FC<FooterProps> = ({}) => {
  return (
    <Wrapper>
      <Text>Designed By Bence</Text>
    </Wrapper>
  );
};
export default Footer;
