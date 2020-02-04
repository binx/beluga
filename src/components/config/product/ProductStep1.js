import React, { useState } from 'react';
import styled from "styled-components";
import { URLize } from "../../../util";

import { Button, TextField } from '@material-ui/core';
import HighlightOff from '@material-ui/icons/HighlightOff';

const Detail = styled.div `
  display: flex;
  align-items: center;
  justify-content: space-between;
  &:hover { background-color: #f7f7f7; }
`;

function ProductStep1(props) {
  const { product, handleChange } = props;
  const [detailText, setDetailText] = useState("");

  const addDetail = () => {
    const newDetails = product.details ? [...product.details] : [];
    newDetails.push(detailText)
    handleChange('details', newDetails)
    setDetailText("");
  }
  const deleteDetail = i => {
    const newDetails = [...product.details];
    newDetails.splice(i, 1);
    handleChange('details', newDetails)
  }

  const { details = [] } = product;

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
        <p>your product's URL will be
          <b> /product/{URLize(product.name)}</b>
        </p>
      )}
      <TextField
        label="Product Description (optional)"
        value={product.description || ""}
        multiline={true}
        onChange={(e) => handleChange('description', e.target.value)}
        variant="outlined"
        rows="3"
        size="small"
        style={{ marginTop: "40px" }}
        fullWidth
      />

      <TextField
        label="Product Details (optional) (will be rendered as a list of bullet points)"
        value={detailText}
        onChange={(e) => setDetailText(e.target.value)}
        margin="normal"
        style={{ width: "90%" }}
      />
      <Button
        onClick={addDetail} 
        variant="contained" color="secondary" size="small"
        style={{ verticalAlign: "bottom", margin: "0 0 10px 20px" }}
      >
        Add
      </Button>
      <ul>
        {details.map((d,i) => (
          <li key={`detail${i}`}>
            <Detail>
              {d}
              <HighlightOff fontSize="small" 
                onClick={() => deleteDetail(i)}
                style={{ cursor: "pointer", color: "#888" }}
              />
            </Detail>
          </li>
        ))}
      </ul>
    </div>
  );
};
export default ProductStep1;