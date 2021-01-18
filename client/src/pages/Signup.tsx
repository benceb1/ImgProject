import { setAccessToken } from "#root/accessToken";
import { Button, FormAuthLink } from "#root/components/GlobalStyledComponents";
import {
  MeDocument,
  MeQuery,
  useRegisterMutation,
} from "#root/generated/graphql";
import * as React from "react";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { RouteComponentProps } from "react-router-dom";
import styled from "styled-components";
import InputField from "../components/InputField";

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
  color: #80868b;
  margin: 1rem 0 2rem 0;
  font-weight: 500;
`;

interface FormData {
  name: string;
  email: string;
  password: string;
  verifyPassword: string;
}

const Signup: React.FC<RouteComponentProps> = ({ history }) => {
  const [registerMutation] = useRegisterMutation();

  const password = useRef({});

  const {
    formState: { isSubmitting },
    register,
    handleSubmit,
    errors,
    reset,
    setError,
    watch,
  } = useForm<FormData>();

  password.current = watch("password", "");

  const onSubmit = async ({ name, email, password }: FormData) => {
    try {
      const { data } = await registerMutation({
        variables: {
          name,
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
              me: data.register.user,
            },
          });
        },
      });
      if (!data?.register.user && data?.register.errors) {
        data.register.errors.forEach(async (responseError) => {
          await setError(
            responseError.field as keyof FormData,
            { types: "server", message: responseError.message } as any
          );
        });
      } else {
        setAccessToken(data?.register.token as string);
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
        <HeaderText>Sign Up</HeaderText>
        <InputContainer>
          <InputField
            errorMessage={errors.name?.message}
            label="name"
            name="name"
            disabled={isSubmitting}
            ref={register({
              required: {
                value: true,
                message: "You must enter your name",
              },
            })}
          />
        </InputContainer>
        <InputContainer>
          <InputField
            errorMessage={errors.email?.message}
            label="email"
            name="email"
            type="email"
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
        <InputContainer>
          <InputField
            errorMessage={errors.verifyPassword?.message}
            label="verify password"
            name="verifyPassword"
            type="password"
            disabled={isSubmitting}
            ref={register({
              validate: (value) =>
                value === password.current || "The passwords do not match",
            })}
          />
        </InputContainer>
        <Button disabled={isSubmitting} type="submit">
          Sign Up
        </Button>
        <FormAuthLinkContainer>
          <FormAuthLink to="/login">
            Already have an account? Log in.
          </FormAuthLink>
        </FormAuthLinkContainer>
      </FormContainer>
    </Wrapper>
  );
};
export default Signup;
