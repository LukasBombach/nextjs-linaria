import { styled } from "@linaria/react";
import { css } from "@linaria/core";

import type { NextPage } from "next";

css`
  :global() {
    body {
      background: black;
      font-family: sans-serif;
    }
  }
`;

const uppercase = css`
  text-transform: uppercase;
`;

const Title = styled.h1`
  font-size: 2rem;
`;

const Container = styled.div<{ color: string }>`
  border: 1px solid ${props => props.color};

  ${Title} {
    color: ${props => props.color};
  }
`;

const Home: NextPage = () => {
  return (
    <Container color="red">
      <Title className={uppercase}>hello world</Title>
    </Container>
  );
};

export default Home;
