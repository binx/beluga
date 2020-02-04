import React from 'react';
import styled from "styled-components";

import { RadioGroup, Radio, FormControlLabel, Button } from '@material-ui/core';

const Label = styled.label `
  display: inline-block;
  min-width: 120px;
  margin-right: 20px;
  font-weight: bold;
`;

function ShippingOptions(props) {
  const { options, shippingOption } = props;

  const selectOption = e => {
    const newOption = options.find(o => o.name === e.target.value);
    props.setShippingOption(newOption)
  }

  const getLabel = o => (
    <div>
      <Label>{o.name}</Label>
      <span>{(o.price/100).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</span>
    </div>
  )

  return (
    <div style={{ marginTop: "20px"}}>
      <RadioGroup
        value={shippingOption ? shippingOption.name : ""}
        onChange={selectOption}
      >
        { options.map((o,i) => (
          <FormControlLabel
            key={`radio${i}`}
            value={o.name}
            control={<Radio />}
            label={getLabel(o)}
          />
        ))}
      </RadioGroup>
      <Button
        variant="contained" color="primary"
        style={{ marginTop: "40px" }}
        disabled={!shippingOption}
        onClick={props.createOrder}
      >
        Continue
      </Button>
    </div>
  );
}
export default ShippingOptions;