import { createGlobalStyle } from "styled-components/macro";

const GlobalStyle = createGlobalStyle`
  * {
    font-family: 'NanumSquare', sans-serif !important;
    font-display: 'block';
    box-sizing : border-box;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  html {
    font-size : 10px;
   
  }
  button {
    cursor: pointer;
  }
  
  body {
    margin: 0;
    user-select : none;
    background-color:black;
  }


  
  ul {
    list-style-type: none;
    padding : 0;
  }
`;

export default GlobalStyle;
