import React, { useState } from 'react';
import styled from 'styled-components';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';

const FlexWrapper = styled.div `
  margin: 20px 0 40px;
`;
const Row = styled.div `
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  font-size: 14px;
  > label {
    line-height: 34px;
    font-weight: 600;
    color: rgba(0, 0, 0, 0.87);
    text-transform: capitalize;
  }
`;
const Right = styled.div `
  display: flex;
  flex-direction: row-reverse;
  margin: 30px 0 60px;
  align-items: baseline;
`;
const Description = styled.div `
  color: rgba(0, 0, 0, 0.87);
  font-size: 16px;
  margin-bottom: 20px;
`;
const Details = styled.div `
  clear: both;
  font-size: 14px;
  margin-top: 20px;
  > ul {
    margin: 0;
    padding: 0 20px 0;
    > li {
      margin-bottom: 10px;
    }
  }
`;

const ProductDetails = props => {
  const { variants, inventory } = props;
  const [product, setProduct] = useState(props.product);

  const selectOption = name => event => {
    const newProduct = Object.assign({ ...product }, {
      [name]: event.target.value
    });
    setProduct(newProduct)

    const index = event.target.selectedIndex;
    const selectedOption = event.target.childNodes[index]
    const sku_id = selectedOption.getAttribute('sku_id');
    const price = selectedOption.getAttribute('price');
    const inventory = selectedOption.getAttribute('inventory');
    if (sku_id)
      props.updateSkuPrice(sku_id, price, inventory);
  }


  let inventoryStatus, noAvailableProducts;
  if (inventory && inventory.type !== "infinite") {
    if (inventory.quantity === 0) {
      inventoryStatus = <div style={{ marginBottom: "10px", fontWeight: "bold" }}>SOLD OUT</div>;
      noAvailableProducts = true;
    } else if (inventory.quantity < 3) {
      inventoryStatus = <div style={{ marginBottom: "10px" }}>{`Hurry! Only ${inventory.quantity} Available`}</div>;
    }
  }

  return (
    <div>
      <h2 style={{ marginTop: "0" }}>{product.name}</h2>
      <Description>{product.description}</Description>
      { !!variants.length &&
        <FlexWrapper>
          {variants.map((v,i) => (
            <Row key={`variant${i}`}>
              <label>{v.name}</label>
              <Select
                native
                value={product[v.name]}
                onChange={selectOption(v.name)}
                style={{ width: "155px", fontSize: "14px", height: "29px" }}
              >
                { v.options.map((option,j) => {
                  if (isNaN(option.label)) {
                    option.label = option.label.charAt(0).toUpperCase() + option.label.slice(1);
                  }
                  return (
                    <option key={j}
                      value={option.label}
                      sku_id={option.sku_id}
                      price={option.price}
                      inventory={JSON.stringify(option.inventory)}
                    >
                      {option.label}
                    </option>
                  );
                })}
              </Select>
            </Row>
          ))}
        </FlexWrapper>
      }
      <div style={{ textAlign: "right", fontSize: "14px", "color": "#555" }}>
        { inventoryStatus }
      </div>
      <div style={{ fontWeight: "600", textAlign: "right" }}>
        {props.price && (Number(props.price)).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
      </div>
      <Right>
        <Button
          variant="contained" color="primary"
          disabled={noAvailableProducts}
          onClick={() => props.addToCart(product)}
        >
          Add To Cart
        </Button>
        {!noAvailableProducts && (
          <TextField
            value={props.quantity}
            onChange={e => props.setQuantity(e.target.value)}
            type="number"
            inputProps={{ min: "1", step: "1", max: inventory ? inventory.quantity : null }}
            margin="normal"
            style={{ width: "40px", margin: "0 30px 0" }}
          />
        )}
      </Right>
      { product.details &&
        <Details>
          <ul>
            {product.details.map((detail,i) =>
              <li key={i}>{detail}</li>
            )}
          </ul>
        </Details>
      }
    </div>
  );
};
export default ProductDetails;