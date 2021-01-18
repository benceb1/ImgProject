import "@babel/polyfill";
import * as React from "react";
import { render } from "react-dom";
import { createGlobalStyle, ThemeProvider } from "styled-components";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import jwtDecode from "jwt-decode";
import { setContext } from "@apollo/client/link/context";
import { createUploadLink } from "apollo-upload-client";
import { TokenRefreshLink } from "apollo-link-token-refresh";

import { ModalProvider } from "#root/context/modalContext";
import App from "./App";
import { getAccessToken, setAccessToken } from "./accessToken";
import { theme } from "./theme";

const BASE_URI = "http://localhost:4001";

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
  }

  body {
    font-family: 'Roboto', sans-serif;
    margin: 0;
    padding: 0;
    overflow-x: hidden;
    height: 100%;
  }
`;

const httpLink = createUploadLink({
  uri: `${BASE_URI}/graphql`,
  credentials: "include",
});

const authLink = setContext(() => {
  const token = getAccessToken();
  return {
    headers: {
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const tokenRefreshLink = new TokenRefreshLink({
  accessTokenField: "accessToken",
  isTokenValidOrUndefined: () => {
    const token = getAccessToken();
    if (!token) {
      console.log("nincs token");
      return true;
    }
    try {
      const { exp }: any = jwtDecode(token);
      if (Date.now() >= exp * 1000) {
        return false;
      } else {
        return true;
      }
    } catch {
      return false;
    }
  },
  fetchAccessToken: () => {
    return fetch(`${BASE_URI}/refresh_token`, {
      method: "POST",
      credentials: "include",
    });
  },
  handleFetch: (accessToken) => {
    setAccessToken(accessToken);
  },
  handleError: (err) => {
    console.warn("Your refresh token is invalid. Try to relogin");
    console.error(err);
  },
});

const client = new ApolloClient({
  link: authLink.concat(httpLink).concat(tokenRefreshLink),
  cache: new InMemoryCache({
    resultCaching: false,
  }),
});

render(
  <ApolloProvider client={client}>
    <ThemeProvider theme={theme}>
      <ModalProvider>
        <GlobalStyle />
        <App />
      </ModalProvider>
    </ThemeProvider>
  </ApolloProvider>,
  document.getElementById("app")
);
