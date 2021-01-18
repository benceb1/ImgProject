import * as React from "react";
import { setAccessToken } from "#root/accessToken";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import {
  MeDocument,
  MeQuery,
  useLogoutMutation,
  useMeQuery,
} from "#root/generated/graphql";

interface AccessIbilityProps {
  closeNav: () => void;
}

const Wrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  flex-grow: 7;

  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    align-items: center;
    border-top: 1px solid ${({ theme }) => theme.fontColor};

    > * {
      margin: 1.5rem 0 1.5rem 0;
    }
  }
`;

const RegisterButton = styled.button`
  border: 0;
  outline: 0;
  margin-left: 0.7rem;
  margin-right: 0.7rem;
  padding: 0.4rem 0.7rem;
  color: ${({ theme }) => theme.fontColor};
  font-size: 1rem;
  font-weight: 600;
  border-radius: 20px;
  background-color: transparent;
  border: 0.16rem solid ${({ theme }) => theme.buttonColor};
  transition: all 0.24s ease-in-out;
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.buttonColor};
  }
`;

const AccessIbility: React.FC<AccessIbilityProps> = ({ closeNav }) => {
  let history = useHistory();
  const { data, loading } = useMeQuery();
  const [logout, { client }] = useLogoutMutation();

  const condition = !loading && data && data.me;

  return (
    <Wrapper>
      {condition ? (
        <RegisterButton
          onClick={async (e) => {
            setAccessToken("");
            await logout({
              update: (store, { data }) => {
                store.writeQuery<MeQuery>({
                  query: MeDocument,
                  data: {
                    __typename: "Query",
                    me: null,
                  },
                });
              },
            });
            await client.resetStore();
            closeNav();
            history.push("/");
          }}
        >
          Logout
        </RegisterButton>
      ) : (
        <>
          <RegisterButton
            onClick={() => {
              closeNav();
              history.push("/login");
            }}
          >
            Login
          </RegisterButton>
          <RegisterButton
            onClick={() => {
              closeNav();
              history.push("/signup");
            }}
          >
            Register
          </RegisterButton>
        </>
      )}
    </Wrapper>
  );
};
export default AccessIbility;
