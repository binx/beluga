import React, { useState, useEffect } from 'react';

import ProductOptions from "./ProductOptions";

function ProductAttribute(props) {
  const { product, handleChange, attributeOptions } = props;

  const [inEditMode, setEditMode] = useState(product.attributes ? false : true);
  const [variant, setVariant] = useState({
    name: product.attributes || "",
    options: []
  })

  useEffect(() => {
    const newVariant = Object.assign({ ...variant }, { options: attributeOptions })
    setVariant(newVariant)
  }, [attributeOptions])

  const updateName = name => {
    const newVariant = Object.assign({ ...variant }, { name })
    setVariant(newVariant)
    handleChange('attributes', name)
  }

  const addVariantOption = label => {
    let skuPost = {
      product_id: product.stripe_id,
      attributes: {
        [product.attributes]: label
      },
      inventory: { type: 'infinite' },
      price: 0
    };

    fetch("/create-sku/", {
        method: 'POST',
        headers: new Headers({ 'content-type': 'application/json' }),
        body: JSON.stringify(skuPost)
      }).then((response) => response.json())
      .then((json) => {
        if (!json.id) {
          console.log("error")
          return;
        }
        const options = [...variant.options];
        options.push({ "label": label, "id": json.id })
        const newVariant = Object.assign({ ...variant }, { options })
        setVariant(newVariant)
      });
  }
  const deleteVariantOption = i => {
    const option = variant.options[i];
    fetch(`/delete-sku/${option.id}`, {
        method: 'POST',
        headers: new Headers({ 'content-type': 'application/json' })
      }).then((response) => response.json())
      .then((json) => {
        if (!json.success) return;
        const options = [...variant.options];
        options.splice(i, 1);
        const newVariant = Object.assign({ ...variant }, { options })
        setVariant(newVariant)
      });
  }

  const updateProduct = () => {
    const postProduct = { "attributes": variant.name };
    fetch(`/update-product/${product.stripe_id}`, {
        method: 'POST',
        headers: new Headers({ 'content-type': 'application/json' }),
        body: JSON.stringify(postProduct)
      }).then(response => response.json())
      .then(result => {
        if (!result.success) return;
        setEditMode(false);
      })
  }

  return (
    <ProductOptions
      inEditMode={inEditMode}
      setEditMode={setEditMode}
      onSave={updateProduct}
      variant={variant}
      handleNameChange={updateName}
      addVariantOption={addVariantOption}
      deleteVariantOption={deleteVariantOption}
    />
  );
};
export default ProductAttribute;