import styled from "styled-components";

export const Button = styled.button`
  align-self: center;
  color: ${({ theme }) => theme.white};
  font-size: 2.6rem;
  font-weight: 200;
  background-color: transparent;
  padding: 1rem 2rem;
  border-radius: 10px;
  border: ${({ theme }) => `1px solid ${theme.white}`};
`;
