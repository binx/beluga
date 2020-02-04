import React, { useState, useEffect } from 'react';
import styled from "styled-components";

import ProductAttribute from "./ProductAttribute";
import ProductVariants from "./ProductVariants";

import { Button } from '@material-ui/core';

const Note = styled.span `
  font-size: 12px;
  display: inline-block;
  vertical-align: bottom;
  margin-bottom: 15px;
`;

function ProductStep2(props) {
  const { product, handleChange } = props;

  const [hasAttributes, setHasAttributes] = useState(!!product.attributes);
  const [hasVariants, setHasVariants] = useState(!!product.variants);
  const [checkingAttributes, setCheckingAttributes] = useState(true);
  const [allowAttributes, setAllowAttributes] = useState(true)
  const [attributeOptions, setAttributeOptions] = useState([]);

  useEffect(() => {
    fetch(`/product-info/${product.stripe_id}`)
      .then(res => res.json())
      .then(result => {
        setCheckingAttributes(false)
        if (!result.data.length) return;

        if (!!product.attributes) {
          const options = result.data.filter(d => d.attributes[product.attributes])
            .map(d => ({
              id: d.id,
              label: d.attributes[product.attributes]
            }))
          setAttributeOptions(options)
        } else {
          setAllowAttributes(false)
        }
      })
  }, [])

  return (
    <div style={{ marginBottom: "40px"}}>
      { !checkingAttributes && allowAttributes && (hasAttributes ? (
        <div>
          <ProductAttribute
            product={product}
            handleChange={handleChange}
            attributeOptions={attributeOptions}
          />
          <Note>(You will set prices in Step 3.)</Note>

          <div style={{ margin: "40px 0", borderTop: "1px solid #ccc" }} />
        </div>
      ) : (
        <div style={{ marginTop: "20px", display: "flex", alignItems: "center" }}>
          <Button style={{ marginRight: "20px" }}
            component="label" variant="contained" color="secondary"
            onClick={() => setHasAttributes(true)}
          >
            Add variants with<b style={{ marginLeft: "5px" }}>different prices</b>
          </Button>
          (for example, size or material options)

          <div style={{ margin: "40px 0", borderTop: "1px solid #ccc" }} />
        </div>
      ))}

      { hasVariants ? (
        <ProductVariants product={product} handleChange={handleChange} />
      ) : (
        <div style={{ marginTop: "20px" }}>
          <Button
            component="label" variant="contained" color="secondary"
            onClick={() => setHasVariants(true)}
          >
            Add variants with<b style={{ marginLeft: "5px" }}>the same price</b>
          </Button>
        </div>
      )}

    </div>
  );
};
export default ProductStep2;