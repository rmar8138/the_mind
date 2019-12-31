import styled from "styled-components";

export const Container = styled.div`
  height: 100vh;
  background-color: ${({ theme }) => theme.black};
  padding: 6rem 4rem;
  display: flex;
  flex-direction: column;
`;
