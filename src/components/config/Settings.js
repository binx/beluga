import React, { useState } from 'react';

import ShippingOptions from "./ShippingOptions";

import { TextField, Button } from '@material-ui/core';

const Settings = ({ storeConfig, handleChange, updateStoreConfig }) => {
  const [options, setOptions] = useState([]);
  const [originalOptions, setOriginalOptions] = useState([]);

  const createSKU = s => {
    let skuPost = {
      product_id: storeConfig.shipping_id,
      attributes: { type: s.name },
      inventory: { type: 'infinite' },
      price: s.price
    };
    return new Promise(function(resolve, reject) {
      fetch("/create-sku/", {
          method: 'POST',
          headers: new Headers({ 'content-type': 'application/json' }),
          body: JSON.stringify(skuPost)
        }).then((response) => response.json())
        .then((json) => {
          if (!json.id) reject();
          resolve(true);
        });
    });
  }

  const updateSKU = s => {
    return new Promise(function(resolve, reject) {
      fetch(`/update-sku/${s.id}`, {
          method: 'POST',
          headers: new Headers({ 'content-type': 'application/json' }),
          body: JSON.stringify({
            price: s.price,
            attributes: { type: s.name }
          })
        }).then((response) => response.json())
        .then((json) => {
          if (!json.success) reject();
          resolve(true);
        });
    });
  }

  const deleteSKU = s => {
    return new Promise(function(resolve, reject) {
      fetch(`/delete-sku/${s.id}`, {
          method: 'POST',
          headers: new Headers({ 'content-type': 'application/json' })
        }).then((response) => response.json())
        .then((json) => {
          if (!json.success) reject();
          resolve(true);
        });
    });
  }

  const saveSettings = () => {
    // find skus that originally existed, but no longer
    const deleteSKUs = originalOptions.filter(o => (
      !options.find(p => p.id === o.id)
    ))

    let createSKUs = [];
    let updateSKUs = [];

    // if it doesn't have an ID, it's new, otherwise update it
    options.forEach(o => {
      if (!o.id) createSKUs.push(o);
      else updateSKUs.push(o);
    })

    const skuUpdates = [
      ...deleteSKUs.map(deleteSKU),
      ...createSKUs.map(createSKU),
      ...updateSKUs.map(updateSKU)
    ]

    Promise.all(skuUpdates)
      .then(result => console.log("SKU updates:", result))
      .catch(err => console.log(err))

    updateStoreConfig(null, true)
  }

  return (
    <div>
      <TextField
        label="Store Name"
        value={storeConfig.store_name}
        onChange={(e) => handleChange("store_name", e.target.value)}
        margin="normal"
        fullWidth
      />

      <TextField
        label="Stripe API Key"
        value={storeConfig.api_key}
        onChange={(e) => handleChange('api_key', e.target.value)}
        margin="normal"
        fullWidth
      />

      <ShippingOptions
        shipping_id={storeConfig.shipping_id}
        setShippingID={id => handleChange("shipping_id", id)}
        options={options}
        setOptions={setOptions}
        setOriginalOptions={setOriginalOptions}
      />
      
      <div>
        <Button variant="contained" color="primary"
          style={{ marginTop: "40px" }}
          onClick={saveSettings}
        >
          Save
        </Button>
      </div>
    </div>
  );
};
export default Settings;