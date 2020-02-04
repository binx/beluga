import React from 'react';
import styled from "styled-components";

const Flex = styled.div `
  display: flex;
  flex-wrap: wrap;
`;
const Wrapper = styled.div `
  width: 100px;
  margin-right: 20px;
`;
const IMG = styled.div `
  background-color: #eee;
  width: 100px;
  height: 100px;
  background-size: cover;
  background-repeat: no-repeat;
  display: inline-block;
  background-position: 50%;
`;

const CollectionImageList = ({ storeConfig, products }) => (
  <Flex>
    {products.map((id,i) => {
      const product = storeConfig.products.find(p => p.stripe_id === id);
      if (!product) return(null);

      const img_url = product.photos && !!product.photos.length
        ? `url("${process.env.PUBLIC_URL}/assets/${id}/${product.photos[0].name}")`
        : null;

      return(
        <Wrapper key={`product${i}`}>
          <IMG style={{ backgroundImage: img_url }} />
          <div style={{ fontSize: "12px" }}>{product.name}</div>
        </Wrapper>
      )
    })}
  </Flex>
);
export default CollectionImageList;