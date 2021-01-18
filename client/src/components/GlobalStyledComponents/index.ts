import * as React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

export const Button = styled.button`
  border: 0;
  outline: 0;
  padding: 8px 1em;
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  border-radius: 20px;
  background-color: #2980b9;
  background-image: linear-gradient(
    to right,
    transparent 0%,
    ${({ theme }) => theme.buttonColor} 100%
  );
  transition: all 0.22s ease-in-out;
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.buttonColor};
  }

  &:not(:last-of-type) {
    margin-right: 7px;
  }
`;

export const FormAuthLink = styled(Link)`
  color: ${({ theme }) => theme.fontColor};
  text-decoration: none;
`;
