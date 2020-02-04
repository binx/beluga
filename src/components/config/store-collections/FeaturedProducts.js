import React, { useState } from 'react';
import { withRouter } from "react-router-dom";
import { leaf } from "../../../util";

import { useSelector, useDispatch } from "react-redux";

import AddProductToCollection from "../collection/AddProductToCollection";

import PageWrapper from '../../ui/PageWrapper';
import { Paper, Button } from "@material-ui/core";

function FeaturedProducts(props) {
  const [collection, setCollection] = useState(props.collection);
  const storeConfig = useSelector(state => state.reducers.config);
  const dispatch = useDispatch();

  const handleChange = (name, value) => {
    const update = leaf(collection, name, value);
    const newCollection = Object.assign({ ...collection }, update);
    setCollection(newCollection);
  }

  const saveConfig = () => {
    let newCollections = [...storeConfig.collections];
    const collectionIndex = newCollections.findIndex(p => p.url === "featured-products")
    if (collectionIndex !== -1) newCollections[collectionIndex] = collection;
    postConfig(newCollections)
  }

  const postConfig = newCollections => {
    const newConfig = Object.assign({ ...storeConfig }, { collections: newCollections });
    dispatch({ type: "SET_COLLECTIONS", collections: newCollections })

    fetch("/config", {
        method: 'POST',
        headers: new Headers({ 'content-type': 'application/json' }),
        body: JSON.stringify(newConfig)
      }).then((response) => response.json())
      .then(result => {
        if (!result.success) console.log("error")
        props.history.push("/config?tab=1");
      });
  }

  if (!storeConfig) return (null);

  return (
    <PageWrapper>
      <Paper style={{ position: "relative", padding: "40px" }}>
        <h2 style={{ margin: 0 }}>{collection.name}</h2>
        <p style={{ fontSize: "14px" }}><b>Featured Products</b> is the default collection for your store's landing page.</p>
        <p style={{ fontSize: "14px" }}>Other collections will appear on <b>/shop</b>, and also allow the option to set a cover image and collection description.</p>

        <AddProductToCollection
          collection={collection}
          storeConfig={storeConfig}
          handleChange={handleChange}
        />

        <Button
          variant="contained" color="primary" 
          onClick={saveConfig}
        >
          Save
        </Button>
      </Paper>
    </PageWrapper>
  );
};
export default withRouter(FeaturedProducts);