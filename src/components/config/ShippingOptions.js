import React, { useEffect } from 'react';
import styled from "styled-components";

import TextFieldDecimal from "../ui/TextFieldDecimal";

import { TextField, Button } from '@material-ui/core';
import HighlightOff from '@material-ui/icons/HighlightOff';

const ShippingWrapper = styled.div `
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 20px;
  margin: 20px 0;
`
const ShipOpt = styled.div `
  display: flex;
  align-items: center;
`;

const ShippingOptions = (props) => {
  const { shipping_id, options, setOptions } = props;

  useEffect(() => {
    if (!shipping_id) return;

    fetch(`/product-info/${shipping_id}`)
      .then(res => res.json())
      .then(result => {
        if (!result.data.length) {
          addOption();
          return;
        }
        const newOptions = result.data.map(sku => ({
          id: sku.id,
          price: sku.price,
          name: sku.attributes["type"]
        }))
        setOptions(newOptions);
        props.setOriginalOptions(newOptions);
      }).catch(err => {
        // if error, we don't know this shipping product, so set to blank
        props.setShippingID(null);
      })
  }, [shipping_id])

  const handleUpdate = (index, name, value) => {
    const newOptions = [...options]
    newOptions[index][name] = value;
    setOptions(newOptions)
  }
  const deleteOption = i => {
    const newOptions = [...options]
    newOptions.splice(i, 1)
    setOptions(newOptions)
  }
  const addOption = () => {
    const newOptions = [...options]
    newOptions.push({ name: "", price: 0 })
    setOptions(newOptions)
  }

  const createShippingProduct = () => {
    const shippingProduct = {
      name: "Flat-Rate Shipping",
      attributes: "type"
    };
    fetch('/create-product', {
        method: 'POST',
        headers: new Headers({ 'content-type': 'application/json' }),
        body: JSON.stringify(shippingProduct)
      }).then(response => response.json())
      .then(newProduct => {
        props.setShippingID(newProduct.id);
        addOption();
      });
  }

  if (!shipping_id)
    return (
      <Button variant="contained" color="secondary" size="small"
        style={{ marginTop: "40px" }}
        onClick={createShippingProduct}
      >
        Add Shipping Options
      </Button>
    )

  return (
    <ShippingWrapper>
      <h3 style={{ marginTop: 0 }}>Shipping Options</h3>
      { options.map((s,i) => {
        return (
          <ShipOpt key={`shipping${i}`}>
            <TextField
              label="Shipping Name"
              style={{ width: "180px", marginRight: "40px" }}
              value={s.name}
              onChange={(e) => handleUpdate(i, "name", e.target.value)}
              margin="normal"
            />
            <TextFieldDecimal
              price={s.price}
              updatePrice={v => handleUpdate(i, "price", v)}
            />

            <HighlightOff fontSize="small" 
              onClick={() => deleteOption(i)}
              style={{ cursor: "pointer", color: "#888", marginLeft: "40px" }}
            />
          </ShipOpt>
        )
      })}

      <Button variant="outlined" color="secondary" size="small"
        style={{ marginTop: "20px" }}
        onClick={addOption}
      >
        Add Option
      </Button>
    </ShippingWrapper>
  );
};
export default ShippingOptions;