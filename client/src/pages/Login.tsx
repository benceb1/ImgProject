import * as React from "react";
import { RouteComponentProps } from "react-router-dom";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import { setAccessToken } from "#root/accessToken";
import { MeDocument, MeQuery, useLoginMutation } from "#root/generated/graphql";
import InputField from "#root/components/InputField";
import { Button, FormAuthLink } from "#root/components/GlobalStyledComponents";

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 90vh;
`;

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  width: 400px;
  padding: 2rem 3rem;
  margin: 0 1rem 0 1rem;
  border-radius: 1rem;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
`;

const InputContainer = styled.div`
  margin-bottom: 0.9rem;
`;

const FormAuthLinkContainer = styled.div`
  margin-top: 2rem;
  text-align: center;
`;

const HeaderText = styled.h1`
  color: ${({ theme }) => theme.fontColor};
  margin: 1rem 0 2rem 0;
  font-weight: 500;
`;

interface FormData {
  email: string;
  password: string;
}

const Login: React.FC<RouteComponentProps> = ({ history }) => {
  const [loginMutation] = useLoginMutation();

  const {
    formState: { isSubmitting },
    register,
    handleSubmit,
    errors,
    reset,
    setError,
  } = useForm<FormData>();

  const onSubmit = async ({ email, password }: FormData) => {
    try {
      const { data } = await loginMutation({
        variables: {
          email,
          password,
        },
        update: (store, { data }) => {
          if (!data) {
            return null;
          }
          store.writeQuery<MeQuery>({
            query: MeDocument,
            data: {
              __typename: "Query",
              me: data.login.user,
            },
          });
        },
      });
      if (!data?.login.user && data?.login.errors) {
        data.login.errors.forEach(async (responseError) => {
          await setError(
            responseError.field as keyof FormData,
            { types: "server", message: responseError.message } as any
          );
        });
      } else {
        setAccessToken(data?.login.token as string);
        reset();
        history.push("/");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Wrapper>
      <FormContainer onSubmit={handleSubmit(onSubmit)}>
        <HeaderText>Sign In</HeaderText>
        <InputContainer>
          <InputField
            errorMessage={errors.email?.message}
            label="email"
            name="email"
            disabled={isSubmitting}
            ref={register({
              required: {
                value: true,
                message: "You must enter your email",
              },
            })}
          />
        </InputContainer>
        <InputContainer>
          <InputField
            errorMessage={errors.password?.message}
            label="password"
            name="password"
            type="password"
            disabled={isSubmitting}
            ref={register({
              required: {
                value: true,
                message: "You must enter your password",
              },
            })}
          />
        </InputContainer>
        <Button disabled={isSubmitting} type="submit">
          Sign in
        </Button>
        <FormAuthLinkContainer>
          <FormAuthLink to="/signup">
            New to site? Create an account.
          </FormAuthLink>
        </FormAuthLinkContainer>
      </FormContainer>
    </Wrapper>
  );
};
export default Login;
