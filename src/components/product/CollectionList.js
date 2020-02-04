import React from 'react';
import styled from 'styled-components';
import { Link } from "react-router-dom";

import PageWrapper from '../ui/PageWrapper';
import Paper from '@material-ui/core/Paper';
import ProductList from './ProductList';

const Wrapper = styled.div `
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 40px;
`;
const IMG = styled.div `
  background-color: #ddd;
  width: 100%;
  padding-bottom: 50%;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: 50%;
  display: inline-block;
  margin-bottom: 10px;
`;

const CollectionList = ({ config }) => {
  let displayCollections = [...config.collections]
    .filter(f => f.url !== "featured-products");

  if (!!!displayCollections.length) {
    return (
      <PageWrapper>
        <Paper style={{ padding: "40px" }}>
          <h2 style={{ marginTop: 0, fontWeight: 600, color: "black" }}>All Products</h2>
          <ProductList products={config.products} collection={"All Products"} />
        </Paper>
      </PageWrapper>
    )
  }


  return (
    <PageWrapper>
      <Paper style={{ padding: "40px" }}>
        <Wrapper>
          { displayCollections.map((c,i) => (
            <Link key={`type${i}`}
              to={`/collection/${c.url}`}
              style={{ textDecoration: "none" }}
            >
              <IMG style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/assets/collection-${c.id}/${c.cover})` }} />
              <h3 style={{ marginTop: 0, fontWeight: 600, color: "black" }}>{c.name}</h3>
            </Link>
          ))}
        </Wrapper>
      </Paper>
    </PageWrapper>
  );
};
export default CollectionList;