import { useMeQuery } from "#root/generated/graphql";
import * as React from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import img from "#root/assets/kep2.png";
import { Button } from "#root/components/GlobalStyledComponents";

interface HomeProps {}

const Wrapper = styled.header`
  height: calc(100vh - 9.688rem);
  color: ${({ theme }) => theme.fontColor};
  display: flex;
  justify-content: center;
  align-items: center;
  @media (max-width: 1250px) {
    flex-direction: column;
  }
`;

const Title = styled.h1`
  font-size: 2.3rem;
  letter-spacing: 0.1rem;
`;

const Text = styled.p`
  font-size: 1.5rem;
`;

const TextContainer = styled.div`
  margin: 2rem;
  display: flex;
  flex-direction: column;
  ${Button} {
    font-size: 1.4rem;
  }

  @media (max-width: 1250px) {
    justify-content: center;
    text-align: center;
    align-items: center;
  }

  @media (max-width: 700px) {
    ${Title} {
      font-size: 2.5 rem;
    }
    ${Text} {
      font-size: 1rem;
    }
    ${Button} {
      font-size: 1rem;
    }
  }
`;

const ImageContainer = styled.div`
  margin: 2rem;
  img {
    width: 600px;
  }
  @media (max-width: 1250px) {
    margin: 1rem;
    img {
      width: 500px;
    }
  }

  @media (max-width: 700px) {
    img {
      width: 90%;
    }
  }
`;

const Home: React.FC<HomeProps> = ({}) => {
  const history = useHistory();
  const { data } = useMeQuery();

  return (
    <Wrapper>
      <TextContainer>
        <Title>
          Welcome {data?.me?.name ? data.me.name + "!" : "To This Site"}
        </Title>
        <Text>You can upload your images here with description</Text>
        {data?.me?.name ? (
          <Button onClick={() => history.push("/images")}>
            Next to images
          </Button>
        ) : (
          <Button onClick={() => history.push("/login")}>Next to login</Button>
        )}
      </TextContainer>
      <ImageContainer>
        <img src={img} />
      </ImageContainer>
    </Wrapper>
  );
};
export default Home;
