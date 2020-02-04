import React from 'react';
import styled from "styled-components";
import { Link } from "react-router-dom";

import CollectionImageList from "./CollectionImageList";

import { Button } from '@material-ui/core';

const Wrapper = styled.div `
  border: 1px solid #ccc;
  padding: 20px;
  margin-bottom: 40px;
  border-radius: 5px;
`;
const Flex = styled.div `
  display: flex;
  align-items: center;
  flex-wrap: wrap;
`;
const Note = styled.div `
  color: #888;
  font-size: 14px;
  font-style: italic;
`;

const CollectionDisplay = props => {
  const { c, storeConfig } = props;
  return (
    <Wrapper >
      <Flex style={{ marginBottom: "20px" }}>
        <h3 style={{ margin: 0, flex: 1 }}>
          <Link to={`/config/collection/${c.url}`} style={{ color: "black", textDecorationColor: storeConfig.colors.primary.main}}>
            {c.name}
          </Link>
        </h3>
        <Link to={`/collection/${c.url}`} style={{ textDecoration: "none" }}>
          <Button variant="contained" color="primary" size="small">
            View
          </Button>
        </Link>
        { c.url !== "featured-products" && (
          <Button
            variant="outlined" color="primary"
            style={{ marginLeft: "20px" }}
            onClick={() => {
              props.setModalCollection(c)
              props.setModalOpen(true)
            }}
          >
            Delete
          </Button>
        )}
      </Flex>
      <Flex>
        {!!c.products.length ? (
          <CollectionImageList
            storeConfig={storeConfig}
            products={c.products}
          />
        ): (
          <Note>No products added yet.</Note>
        )}
      </Flex>
    </Wrapper>
  );
};
export default CollectionDisplay;