import React from 'react';

import NumberFormat from 'react-number-format';
import { TextField } from '@material-ui/core';

function NumberFormatCustom(props) {
  const { inputRef, onChange, ...other } = props;

  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={values => {
        onChange({
          target: {
            value: values.value,
          },
        });
      }}
      thousandSeparator
      decimalScale={2}
      fixedDecimalScale={true}
      isNumericString
      prefix="$"
    />
  );
}

const TextFieldDecimal = ({ price, updatePrice }) => (
  <TextField
    label="Price"
    value={price/100}
    onChange={e => updatePrice(Number(e.target.value)*100)}
    InputProps={{
      inputComponent: NumberFormatCustom,
    }}
  />
);
export default TextFieldDecimal;