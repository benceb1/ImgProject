import * as React from "react";
import styled from "styled-components";

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  errorMessage?: string;
  label: string;
}

const Wrapper = styled.div``;

const FormWrapper = styled.div`
  position: relative;
  height: 2.7rem;
`;

const FormLabel = styled.label`
  position: absolute;
  left: 0.75rem;
  top: 0.75rem;
  padding: 0 0.25rem;
  background-color: #fff;
  color: ${({ theme }) => theme.fontColor};
  font-size: 1rem;
  transition: 0.3s;
  font-weight: 400;
`;

const FormInput = styled.input`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  font-size: 1rem;
  border: 1px solid ${({ theme }) => theme.fontColor};
  border-radius: 0.4rem;
  outline: none;
  padding: 1rem;
  background: none;
  z-index: 1;
  transition: 0.5s;
  &:focus + ${FormLabel} {
    top: -0.5rem;
    left: 0.8rem;
    font-size: 0.75rem;
    font-weight: 400;
    z-index: 10;
  }
  &:not(:placeholder-shown) + ${FormLabel} {
    top: -0.5rem;
    left: 0.8rem;
    font-size: 0.75rem;
    font-weight: 500;
    z-index: 10;
  }
  &:hover {
    border: 1px solid #16a085;
  }
  &:focus {
    background-color: #fff;
    border-color: rgba(0, 0, 0, 0.25);
    -webkit-box-shadow: 0 0 0 4px rgba(0, 0, 0, 0.05);
    box-shadow: 0 0 0 4px rgba(0, 0, 0, 0.05);
  }
`;

const ErrorLabel = styled.label`
  margin-left: 0.4rem;
  color: #cc0000;
  font-size: 0.9rem;
`;

const ErrorLabelContainer = styled.div`
  margin-top: 0.1rem;
  height: 0.9rem;
`;

export const InputField = React.forwardRef<any, InputFieldProps>(
  ({ label, errorMessage, ...rest }, ref) => {
    return (
      <Wrapper>
        <FormWrapper>
          <FormInput ref={ref} {...rest} placeholder="&nbsp;" />
          <FormLabel>{label}</FormLabel>
        </FormWrapper>
        <ErrorLabelContainer>
          {errorMessage && <ErrorLabel>{errorMessage}</ErrorLabel>}
        </ErrorLabelContainer>
      </Wrapper>
    );
  }
);
