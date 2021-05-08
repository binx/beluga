import React, { useState } from 'react';
import styled from "styled-components";
import { URLize } from "../../../util";

import DuplicateProduct from "./DuplicateProduct";

import { Button, TextField } from '@material-ui/core';
import HighlightOff from '@material-ui/icons/HighlightOff';

const Flex = styled.div`
  display: flex;
  margin-top: 40px;
`;
const BulletPoint = styled.div `
  display: flex;
  align-items: center;
  justify-content: space-between;
  &:hover { background-color: #f7f7f7; }
`;

function ProductStep1({ product, handleChange }) {
  const [bulletText, setBulletText] = useState("");

  const addBulletPoint = () => {
    const newBulletPoints = product.bulletPoints ? [...product.bulletPoints] : [];
    newBulletPoints.push(bulletText)
    handleChange('bulletPoints', newBulletPoints)
    setBulletText("");
  }
  const deleteBulletPoint = i => {
    const newBulletPoints = [...product.bulletPoints];
    newBulletPoints.splice(i, 1);
    handleChange('bulletPoints', newBulletPoints)
  }

  const { bulletPoints = [] } = product;

  return (
    <div style={{ marginBottom: "60px"}}>
      <TextField
        label="Product Name"
        value={product.name}
        onChange={(e) => {
          handleChange('name', e.target.value)
          handleChange('url', URLize(e.target.value))
        }}
        margin="normal"
        fullWidth
      />
      {!!product.name.length && (
        <p>
          your product's URL will be
          <b> /product/{URLize(product.name)}</b>
        </p>
      )}
      <Flex>
        <div style={{ flex: 1 }}>
          <TextField
            label="Product Description"
            value={product.description || ""}
            multiline={true}
            onChange={(e) => handleChange("description", e.target.value)}
            variant="outlined"
            rows="3"
            size="small"
            fullWidth
          />

          <TextField
            label="Product Bullet Points"
            value={bulletText}
            onChange={(e) => setBulletText(e.target.value)}
            margin="normal"
            style={{ width: "calc(100% - 84px)" }}
          />
          <Button
            onClick={addBulletPoint} 
            variant="contained" color="secondary" size="small"
            style={{ verticalAlign: "bottom", margin: "0 0 10px 20px" }}
          >
            Add
          </Button>
          <ul>
            {bulletPoints.map((d,i) => (
              <li key={`bullet${i}`}>
                <BulletPoint>
                  {d}
                  <HighlightOff fontSize="small" 
                    onClick={() => deleteBulletPoint(i)}
                    style={{ cursor: "pointer", color: "#888" }}
                  />
                </BulletPoint>
              </li>
            ))}
          </ul>
        </div>
        {!product.stripe_id && (
          <DuplicateProduct
            product={product}
            handleChange={handleChange}
          />
        )}
      </Flex>
    </div>
  );
};
export default ProductStep1;