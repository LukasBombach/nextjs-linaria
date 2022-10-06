import { styled } from "@linaria/react";
import { css } from "@linaria/core";

import type { NextPage } from "next";

css`
  :global() {
    body {
      background: black;
    }
  }
`;

const uppercase = css`
  text-transform: uppercase;
`;

const Container = styled.div<{ color: string }>`
  font-size: 16px;
  color: ${props => props.color};
  border: 1px solid ${props => props.color};

  &:hover {
    border-color: blue;
    color: blue;
  }
`;

const Home: NextPage = () => {
  return (
    <Container color="red">
      <h1 className={uppercase}>hello world</h1>
    </Container>
  );
};

export default Home;
