import React, { useState } from 'react';
import styled from "styled-components";

import { useSelector } from "react-redux";

import Autocomplete from '@material-ui/lab/Autocomplete';
import { TextField, Button } from '@material-ui/core';

const Wrapper = styled.div`
  border-left: 1px dashed #888;
  padding-left: 20px;
  margin-left: 20px;
  max-width: 300px;
`;

function DuplicateProduct({ product, handleChange }) {
  const [productToCopy, setProductToCopy] = useState();
  const [hasBeenCopied, setHasBeenCopied] = useState(false);
  const config = useSelector(state => state.reducers.config);

  const copyProduct = () => {
    const postProduct = {
      name: product.name
    }

    const attrs = ["description", "bulletPoints", "attributes", "details"];
    attrs.forEach(attr => {
      if (productToCopy[attr]) {
        handleChange(attr, productToCopy[attr])
        postProduct[attr] = productToCopy[attr];
      }
    });

    fetch('/create-product', {
        method: 'POST',
        headers: new Headers({ 'content-type': 'application/json' }),
        body: JSON.stringify(postProduct)
      }).then(response => response.json())
      .then(newProduct => {
        if (!newProduct.id) return;
        handleChange("stripe_id", newProduct.id)
        handleChange("created", newProduct.created)
        
        getCopySKUs(productToCopy.stripe_id, newProduct.id);
      });
  }

  const getCopySKUs = (copyID, newID) => {
    fetch(`/product-info/${copyID}`)
      .then(res => res.json())
      .then(result => {
        if (!result.data.length) return;

        const skusToCopy = result.data.map(d => ({
            attributes: d.attributes,
            price: d.price,
            inventory: d.inventory
          }));

        skusToCopy.forEach(s => copySKU(s, newID));
      })
  }

  const copySKU = (sku, newID) => {
    let skuPost = Object.assign(sku, {
      product_id: newID
    });

    fetch("/create-sku/", {
        method: 'POST',
        headers: new Headers({ 'content-type': 'application/json' }),
        body: JSON.stringify(skuPost)
      }).then((response) => response.json())
      .then((json) => {
        setHasBeenCopied(true);
      });
  }

  if (hasBeenCopied || !config.products.length) return (null);

  return (
    <Wrapper>
      <Autocomplete
        options={config.products}
        getOptionLabel={product => product.name}
        style={{ width: 300, marginBottom: "20px" }}
        value={productToCopy}
        onChange={(e,o) => o && setProductToCopy(o)}
        size="small"
        renderInput={params => (
          <TextField {...params} label="Duplicate Product" variant="outlined" fullWidth />
        )}
      />
      {productToCopy ? (
        <Button onClick={copyProduct} variant="outlined" disabled={!product.name.length}>
          Duplicate
        </Button>
      ) : (
        <div style={{ fontSize: "14px" }}>Instead of filling out all new information, you can also copy the settings from a previous product.</div>
      )}
    </Wrapper>
  );
};
export default DuplicateProduct;