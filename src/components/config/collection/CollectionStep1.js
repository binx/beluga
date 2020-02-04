import React from 'react';
import { URLize } from "../../../util";

import AddProductToCollection from "./AddProductToCollection";

import { TextField } from "@material-ui/core";

function CollectionStep1(props) {
  const { collection, handleChange, storeConfig } = props;
  return (
    <div>
      <TextField
        label="Collection Name"
        value={collection.name}
        onChange={(e) => {
          handleChange('name', e.target.value)
          handleChange('url', URLize(e.target.value))
        }}
        margin="normal"
        fullWidth
      />
      {!!collection.name.length && (
        <p>your collection's URL will be
          <b> /collection/{URLize(collection.name)}</b>
        </p>
      )}

      <AddProductToCollection
        collection={collection}
        storeConfig={storeConfig}
        handleChange={handleChange}
      />
    </div>
  );
};
export default CollectionStep1;