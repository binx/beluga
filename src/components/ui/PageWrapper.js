import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div `
  max-width: 1100px;
  margin: 20px auto 50px;
`;

const PageWrapper = props => (
  <Wrapper>
    { props.children}
  </Wrapper>
);
export default PageWrapper;