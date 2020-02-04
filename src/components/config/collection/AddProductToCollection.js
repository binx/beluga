import React from 'react';

import EditableImageList from "./EditableImageList";

import Autocomplete from '@material-ui/lab/Autocomplete';
import { TextField } from '@material-ui/core';

function AddProductToCollection(props) {
  const { storeConfig, collection, handleChange } = props;

  const addProduct = product => {
    const newProducts = [...collection.products]
    newProducts.unshift(product.stripe_id);
    handleChange("products", newProducts);
  }

  if (!storeConfig) return (null);
  const eligableProducts = [...storeConfig.products]
    .filter(t => collection.products.indexOf(t.stripe_id) === -1)

  return (
    <div>
      <div style={{ margin: "40px 0" }}>
        <Autocomplete
          options={eligableProducts}
          getOptionLabel={product => product.name}
          style={{ width: 300 }}
          onChange={(e,o) => o && addProduct(o)}
          renderInput={params => (
            <TextField {...params} label="Add Product" variant="outlined" fullWidth />
          )}
        />
      </div>
      <EditableImageList
        storeConfig={storeConfig}
        products={collection.products}
        handleChange={handleChange}
      />
    </div>
  );
};
export default AddProductToCollection;