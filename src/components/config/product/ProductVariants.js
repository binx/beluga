import React, { useEffect } from 'react';

import ProductOptions from "./ProductOptions";

function ProductVariants(props) {
  const { product, handleChange } = props;
  const variant = product.variants || { name: "", options: [] };

  useEffect(() => {
    if (!product.variants)
      handleChange("variants", variant)
  }, [])

  const addVariantOption = label => {
    const options = [...variant.options];
    options.push({ "label": label })
    handleChange('variants.options', options)
  }
  const deleteVariantOption = i => {
    const options = [...variant.options];
    options.splice(i, 1);
    handleChange('variants.options', options)
  }

  return (
    <ProductOptions
      variant={variant}
      handleNameChange={name => handleChange('variants.name', name)}
      addVariantOption={addVariantOption}
      deleteVariantOption={deleteVariantOption}
    />
  );
};
export default ProductVariants;