import { createGlobalStyle } from "styled-components";

export const GlobalStyles = createGlobalStyle`
  body {
    background: ${({ theme }) => theme.primary.background};
    color: ${({ theme }) => theme.primary.color};
    transition: ${({ isLoaded }) => (isLoaded ? `all 0.5s linear` : "")};
  }

  input[type="text"] {
    background: ${({ theme }) => theme.primary.color};
    color: ${({ theme }) => theme.primary.background};
    transition: all 0.5s linear
  }
`;

export default GlobalStyles;
