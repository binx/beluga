import React, { useState } from 'react';
import styled from "styled-components";

import { TextField, Button, Chip } from '@material-ui/core';

const Step = styled.div `
  opacity: ${props => props.disabled ? .4 : 1};
  background-color: ${props => props.disabled ?  "#eee" : "white"};
  pointer-events: ${props => props.disabled ?  "none" : "auto"};
`;

function ProductOptions(props) {
  const { variant, handleNameChange, onSave, inEditMode } = props;

  const [variantOptionText, setVariantOptionText] = useState("");

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center" }}>
        {(onSave && !inEditMode) ? (
          <div style={{ fontWeight: "bold", margin: "0 40px 10px 0" }}>
            {variant.name}
          </div>
        ) : (
          <TextField
            label="Option Name (i.e. Size, Color)"
            style={{ width: "350px" }}
            value={variant.name}
            onChange={(e) => handleNameChange(e.target.value)}
            margin="normal"
          />
        )}
        { onSave && inEditMode && (
          <Button
            onClick={onSave}
            variant="outlined" color="secondary" size="small"
            style={{ verticalAlign: "bottom", margin: "0 40px" }}
          >
            Save
          </Button>
        )}
        <div style={{ margin: "0 0 10px 40px", verticalAlign: "bottom", display: "inline-block" }}>
          { variant.options.map((v,i) => (
            <Chip key={`variant${i}`}
              label={v.label}
              onDelete={() => props.deleteVariantOption(i)}
              color="secondary"
              variant="outlined"
              style={{ marginRight: "10px" }}
            />
          ))}
        </div>
      </div>
      <Step disabled={onSave && inEditMode}>
        <TextField
          label="Option Value (i.e. Medium, Blue)"
          value={variantOptionText}
          onChange={(e) => setVariantOptionText(e.target.value)}
          margin="normal"
          size="small"
          style={{ width: "350px" }}
        />
        <Button
          onClick={() => {
            props.addVariantOption(variantOptionText);
            setVariantOptionText("");
          }}
          variant="outlined" color="secondary" size="small"
          style={{ verticalAlign: "bottom", margin: "0 0 10px 40px" }}
        >
          Add
        </Button>
      </Step>
    </div>
  );
};
export default ProductOptions;