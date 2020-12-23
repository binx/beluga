import React, { useState } from 'react';
import { withRouter } from "react-router-dom";
import { generateID } from "../../util";

import PageWrapper from '../ui/PageWrapper';
import { Paper, TextField, Button } from '@material-ui/core';

function InitialConfig(props) {
  const initialConfig = {
    store_name: "",
    api_key: "",
    store_slug: generateID(10),
    colors: {
      primary: {
        main: "#333333",
        dark: "#222222",
        contrastText: "#FFF"
      },
      secondary: {
        main: "#00FFB4",
        contrastText: "#000"
      }
    },
    collections: [{
      name: "Featured Products",
      url: "featured-products",
      id: generateID(5),
      products: []
    }],
    products: []
  };
  const [config, setConfig] = useState(initialConfig);

  const handleChange = (name, value) => {
    const newConfig = Object.assign({ ...config }, {
      [name]: value
    });
    setConfig(newConfig);
  }

  const updateStoreConfig = () => {
    fetch("/config", {
        method: 'POST',
        headers: new Headers({ 'content-type': 'application/json' }),
        body: JSON.stringify(config)
      }).then((response) => response.json())
      .then(result => {
        if (result.success) {
          props.history.push("/config");
          setTimeout(() => {
            window.location.reload();
          }, 100);
        }
      });
  }

  return (
    <PageWrapper>
      <Paper style={{ position: "relative", padding: "40px" }}>

        <h2>Hi! Let's get started on your store.</h2>

        <TextField
          label="Store Name"
          value={config.store_name}
          onChange={(e) => handleChange('store_name', e.target.value)}
          margin="normal"
          fullWidth
        />

        <TextField
          label="Stripe API Key"
          value={config.api_key}
          onChange={(e) => handleChange('api_key', e.target.value)}
          margin="normal"
          fullWidth
        />

        <p>For more info on Stripe keys, please see the <a href="https://belugajs.com/docs/stripe" rel="noopener noreferrer" target="_blank">documentation</a></p>

        <Button
          variant="contained"
          color="primary"
          style={{ marginTop: "40px" }}
          onClick={updateStoreConfig}
          disabled={!config.store_name.length || !config.api_key.length}
        >
          Save
        </Button>

      </Paper>
    </PageWrapper>
  );
};
export default withRouter(InitialConfig);