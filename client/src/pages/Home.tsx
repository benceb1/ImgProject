import { useMeQuery } from "#root/generated/graphql";
import * as React from "react";
import { useHistory } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import img from "#root/assets/kep2.png";
import { Button } from "#root/components/GlobalStyledComponents";

interface HomeProps {}

const drop = keyframes`
  0% {
    opacity: 0;
    transform: translateY(-80px);
  }
  100% {
    opacity: 1;
    transform: translateY(0px);
  }
`;

const Introduction = styled.div`
  flex: 1;
`;

const Cta = styled.div`
  padding: 50px 0px 0px 0px;

  ${Button} {
    max-width: 66%;
    width: 70%;
    font-size: 1.3rem;
    @media (max-width: 762px) {
      font-size: 1rem;
    }
  }
`;

const Wrapper = styled.section`
  height: calc(100vh - 9.688rem);
  color: ${({ theme }) => theme.fontColor};
  display: flex;
  width: 80%;
  margin: auto;
  min-height: 80vh;
  align-items: center;

  @media (max-width: 1200px) {
    width: 90%;
  }

  @media (max-width: 1024px) {
    flex-direction: column;

    ${Introduction} {
      margin-top: 5vh;
      text-align: center;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    ${Cta} {
      padding: 10px 0px 0px 0px;
    }
  }

  @media (max-width: 762px) {
    ${Introduction} {
      margin-top: 0;
    }
  }
`;

const IntroText = styled.div`
  h1 {
    font-size: 44px;
    font-weight: 500;
    background: linear-gradient(
      to right,
      ${({ theme }) => theme.fontColor},
      #6f6f89
    );
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  p {
    margin-top: 5px;
    font-size: 22px;
  }
`;

const Cover = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  img {
    height: 50vh;
    filter: drop-shadow(0px 5px 3px black);
    animation: ${drop} 1.5s ease;
  }

  @media (max-width: 768px) {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 2rem 0 0 0;
    img {
      height: 50vw;
    }
  }
`;

const Home: React.FC<HomeProps> = ({}) => {
  const history = useHistory();
  const { data } = useMeQuery();

  return (
    <main>
      <Wrapper>
        <Introduction>
          <IntroText>
            <h1>
              Welcome {data?.me?.name ? data?.me?.name + "!" : "To this site"}
            </h1>
            <p>You can upload your images here with description</p>
          </IntroText>
          <Cta>
            {data?.me?.name ? (
              <Button onClick={() => history.push("/images")}>
                Next to images
              </Button>
            ) : (
              <Button onClick={() => history.push("/login")}>
                Next to login
              </Button>
            )}
          </Cta>
        </Introduction>
        <Cover>
          <img src={img} alt="coverImage" />
        </Cover>
      </Wrapper>
    </main>
  );
};
export default Home;
