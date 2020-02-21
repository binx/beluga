import React, { useEffect } from 'react';
import styled from "styled-components";

import TextFieldDecimal from "../../ui/TextFieldDecimal";

import { FormControlLabel, Checkbox, TextField } from "@material-ui/core";

const Flex = styled.div `
  display: flex;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 10px 20px;
  margin-bottom: 10px;
  align-items: center;
  > label {
    display: inline-block;
    width: 188px;
    color: #333;
    margin-right: 20px;
  }
`;

function ProductStep3(props) {
  const { product, skus, setSkus } = props;

  useEffect(() => {
    if (!product.stripe_id) return;

    fetch(`/product-info/${product.stripe_id}`)
      .then(res => res.json())
      .then(result => {
        if (result.data.length) {
          const newSkus = result.data.map(d => {
            let s = {
              id: d.id,
              price: d.price,
              inventory: d.inventory
            };
            if (product.attributes)
              s["attributes"] = d.attributes
            return s;
          })
          setSkus(newSkus);
        } else {
          let s = {
            price: 0,
            inventory: { type: "infinite" }
          }
          if (product.attributes)
            s["attributes"] = {
              [product.attributes]: ""
            }

          setSkus([s])
        }
      })
  }, [product.stripe_id])

  const updatePrice = (index, value) => {
    const newSKUs = [...skus];
    newSKUs[index]["price"] = value;
    setSkus(newSKUs)
  }

  const updateInventory = (index, key, value) => {
    const newSKUs = [...skus];
    newSKUs[index]["inventory"][key] = value;
    setSkus(newSKUs)
  }

  if (!skus.length) return (null)

  const attribute = product.attributes;

  return (
    <div style={{ marginBottom: "40px"}}>
      { skus.map((s,i) => (
        <Flex key={`sku${i}`}>
          { attribute && <label>{attribute}</label> }
          { attribute && <label><b>{s.attributes[attribute]}</b></label> }
          <TextFieldDecimal
            price={s.price}
            updatePrice={v => updatePrice(i, v)}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={s.inventory.type === "finite"}
                onChange={v => updateInventory(i, "type", (v.target.checked ? "finite" : "infinite"))}
              />
            }
            label="Has Stock"
          />
          { s.inventory.type === "finite" && (
            <TextField
              value={s.inventory.quantity || 0}
              onChange={e => updateInventory(i, "quantity", e.target.value)}
              type="number"
              inputProps={{ min: "1", step: "1" }}
              label="Quantity"
              style={{ width: "80px" }}
            />
          )}
        </Flex>
      ))}
    </div>
  );
};
export default ProductStep3;