import React, { useState, useEffect } from 'react';
import styled from "styled-components";

import ProductAttribute from "./ProductAttribute";
import ProductDetails from "./ProductDetails";

import { Button } from '@material-ui/core';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';

const Note = styled.span `
  font-size: 12px;
  display: inline-block;
  vertical-align: bottom;
  margin-top: 10px;
`;

function ProductStep2(props) {
  const { product, handleChange } = props;

  const [hasAttributes, setHasAttributes] = useState(!!product.attributes);
  const [hasDetails, setHasDetails] = useState(!!product.details);
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
  }, []);

  const removeDetails = () => {
    handleChange("details", null);
    setHasDetails(null);
  }

  return (
    <div style={{ marginBottom: "40px"}}>
      <h3>Product Variants</h3>
      <p style={{ fontSize: "14px" }}>Use variants for products that have more than one option. Each variant will have its own <b>price</b> and (optional) <b>inventory</b>. For example:</p>
      <ul style={{ fontSize: "14px", marginBottom: "20px" }}>
        <li>Small, Medium, or Large T-shirt sizes</li>
        <li>Gold or Silver finishes for a necklace</li>
      </ul>
      { !checkingAttributes && allowAttributes && (hasAttributes ? (
        <div>
          <ProductAttribute
            product={product}
            handleChange={handleChange}
            attributeOptions={attributeOptions}
          />
          <Note>(You will set prices in Step 3.)</Note>
        </div>
      ) : (
        <Button
          component="label" variant="contained" color="secondary"
          onClick={() => setHasAttributes(true)}
        >
          Add variants
        </Button>
      ))}

      <div style={{ margin: "40px 0", borderTop: "1px solid #ccc" }} />

      <h3 style={{ display: "flex", alignItems: "center", justifyContent: "space-between"}}>
        Product Details
        { hasDetails && (
          <Button
            component="label" variant="outlined" color="primary" size="small"
            onClick={removeDetails}
          >
            <DeleteOutlineIcon style={{ marginRight: "5px" }}/> Remove Details
          </Button>
        )}
      </h3>
      <p style={{ fontSize: "14px" }}>Use options to set additional info about the product. These will apply to all variants of this product. For example:</p>
      <ul style={{ fontSize: "14px", marginBottom: "20px" }}>
        <li>Whether or not to gift-wrap the item</li>
        <li>Which color theme to use in a design</li>
      </ul>
      { hasDetails ? (
        <ProductDetails product={product} handleChange={handleChange} />
      ) : (
        <Button
          component="label" variant="contained" color="secondary"
          onClick={() => setHasDetails(true)}
        >
          Add Details
        </Button>
      )}

    </div>
  );
};
export default ProductStep2;