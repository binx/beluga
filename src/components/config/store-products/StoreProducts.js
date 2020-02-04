import React, { useState } from 'react';
import { Link } from "react-router-dom";
import styled from "styled-components";

import DeleteProductModal from "./DeleteProductModal";

import { Button, Switch } from '@material-ui/core';

const Flex = styled.div `
  display: flex;
  align-items: center;
  border-bottom: 1px solid #ccc;
  padding: 10px 0;
`;
const IMG = styled.div `
  background-color: #eee;
  width: 75px;
  height: 75px;
  background-size: cover;
  background-repeat: no-repeat;
  display: inline-block;
  margin-right: 20px;
  background-position: 50%;
`;
const Note = styled.div `
  color: #888;
  font-size: 14px;
  margin-top: 10px;
  font-style: italic;
`;

function StoreProducts(props) {
  const { storeConfig, handleChange } = props;
  const { products = [] } = storeConfig;

  const [modalOpen, setModalOpen] = useState(false);
  const [modalProduct, setModalProduct] = useState();

  const updateProduct = (index, is_live) => {
    const newProducts = [...products];
    newProducts[index].is_live = is_live;
    handleChange("products", newProducts, true);
  }

  return (
    <div>
      <Link to="/config/product/new" style={{ textDecoration: "none" }}>
        <Button
          variant="contained" color="secondary"
          style={{ marginBottom: "20px" }}
        >
          Create New Product
        </Button>
      </Link>
      {!!products.length ? (
        products.map((p,i) => {
          const img_url = p.photos && !!p.photos.length
            ? `url("${process.env.PUBLIC_URL}/assets/${p.stripe_id}/${p.photos[0].name}")`
            : null;

          const collections = storeConfig.collections
            .filter(c => c.products.indexOf(p.stripe_id) !== -1)
            .map(c => c.name);

          return(
            <Flex key={`one${i}`}>
              <IMG style={{ backgroundImage: img_url }} />
              <div style={{ flex: 1 }}>
                <Link to={`/config/product/${p.url}`} style={{ color: "black", textDecorationColor: storeConfig.colors.primary.main}}>
                  {p.name}
                </Link>
                { !!collections.length && (
                  <Note>Collections: <i>{collections.join(", ")}</i></Note>
                )}
              </div>
              <Link to={`/product/${p.url}`} style={{ textDecoration: "none" }}>
                <Button variant="contained" color="primary" style={{ marginRight: "20px" }}>
                  View
                </Button>
              </Link>
              <Button
                variant="outlined" color="primary"
                style={{ marginRight: "20px" }}
                onClick={() => {
                  setModalProduct(p)
                  setModalOpen(true)
                }}
              >
                Delete
              </Button>
              <div>
                <Switch size="small" 
                  checked={p.is_live}
                  onChange={e => updateProduct(i, e.target.checked)}
                />
                Live on Site
              </div>
            </Flex>
          )
        })
      ) : (
        <Note>No products yet.</Note>
      )}
      <DeleteProductModal
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        modalProduct={modalProduct}
        setModalProduct={setModalProduct}
        handleChange={handleChange}
        products={products}
      />
    </div>
  );
};
export default StoreProducts;