import * as React from "react";
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import styled from "styled-components";

import Navbar from "./components/Navbar";
import Images from "./pages/Images";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import { setAccessToken } from "./accessToken";
import Footer from "./components/Footer";

interface AppProps {}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const App: React.FC<AppProps> = ({}) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:4001/refresh_token", {
      method: "POST",
      credentials: "include",
    }).then(async (x) => {
      const { accessToken } = await x.json();
      setAccessToken(accessToken);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Wrapper>
      <Router>
        <Navbar />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/signup" component={Signup} />
          <Route exact path="/images" component={Images} />
        </Switch>
        <Footer />
      </Router>
    </Wrapper>
  );
};
export default App;
