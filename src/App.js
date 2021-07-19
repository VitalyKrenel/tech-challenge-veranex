import styled, { createGlobalStyle } from 'styled-components';

const AppDefaultStyles = createGlobalStyle`
  html {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    margin: 0;
    padding: 0;
  }

  *,
  *:after,
  *:before {
    box-sizing: inherit;
  }
`;

const appBgColor = '#427937';
const appPrimaryColor = '#000000';

const AppLayout = styled.div`
  width: 100%;
  height: 100vh;
  background-color: ${appBgColor};
  color: ${appPrimaryColor};
`;

const App = () => (
  <>
  <AppDefaultStyles/>
  <AppLayout>

  </AppLayout>
  </>
);

export { App };
