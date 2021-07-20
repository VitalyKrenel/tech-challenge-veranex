import styled, { createGlobalStyle } from 'styled-components';

const AppDefaultStyles = createGlobalStyle`
  html {
    font-family: Roboto, sans-serif;
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

const AppBaseLayout = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  padding-top: 45px;
  width: 100%;
  height: 100vh;

  background-color: ${appBgColor};
  color: ${appPrimaryColor};
`;

const AppLayout = ({ isAppLoading, loadingComponent: LoadingComponent, children }) => (
  <AppBaseLayout>
    {isAppLoading ? (
      <LoadingComponent />
    ) : (
      children
    )}
  </AppBaseLayout>
);

export { AppLayout };