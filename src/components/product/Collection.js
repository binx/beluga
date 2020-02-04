import React from 'react';
import styled from 'styled-components';
import ProductList from './ProductList';
import PageWrapper from '../ui/PageWrapper';
import Paper from '@material-ui/core/Paper';

const Wrapper = styled.div `
  padding: 40px;
  @media (max-width: 650px) {
    padding: 20px;
  }
`;

const Collection = ({ products, title }) => (
  <PageWrapper>
    <Paper>
      <Wrapper>
        <h2 style={{ marginTop: 0, fontWeight: 600 }}>{title}</h2>
        <ProductList products={products} collection={title} />
      </Wrapper>
    </Paper>
  </PageWrapper>
);
export default Collection;