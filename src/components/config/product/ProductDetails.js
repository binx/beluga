import React, { useEffect } from 'react';

import ProductOptions from "./ProductOptions";

function ProductDetails({ product, handleChange }) {
  const details = product.details || { name: "", options: [] };

  useEffect(() => {
    if (!product.details)
      handleChange("details", details)
  }, [])

  const addDetailOption = label => {
    const options = [...details.options];
    options.push({ "label": label })
    handleChange('details.options', options)
  }
  const deleteDetailOption = i => {
    const options = [...details.options];
    options.splice(i, 1);
    handleChange('details.options', options)
  }

  return (
    <ProductOptions
      variant={details}
      handleNameChange={name => handleChange('details.name', name)}
      addVariantOption={addDetailOption}
      deleteVariantOption={deleteDetailOption}
    />
  );
};
export default ProductDetails;