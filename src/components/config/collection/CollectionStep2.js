import React from 'react';
import styled from "styled-components";

import { Button } from "@material-ui/core";

const IMG = styled.div `
  background-color: #ddd;
  width: 500px;
  padding-bottom: 250px;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: 50%;
  display: inline-block;
`;

function CollectionStep2(props) {
  const { collection, handleChange, saveConfig } = props;

  const uploadImage = event => {
    const formData = new FormData()
    // removing all special characters except the last period
    let filename = event.target.files[0].name.replace(/[.](?=.*[.])/g, "").replace(/[^a-zA-Z0-9-_.]/g, '')
    formData.append("file", event.target.files[0], filename)

    fetch(`/upload-image/collection-${collection.id}/`, {
        method: 'POST',
        body: formData
      }).then(response => response.json())
      .then(result => {
        if (!result.success) return;
        handleChange("cover", filename);
        saveConfig();
      })
      .catch(error => console.log(error));
  };

  return (
    <div>
      { collection.cover && (
        <IMG style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/assets/collection-${collection.id}/${collection.cover})` }} />
      )}
      <div>
        <Button
          component="label" variant="contained" color="secondary"
          style={{ marginTop: "40px" }}
        >
          <input
            accept="image/*"
            type="file"
            onChange={uploadImage}
            style={{ display: "none" }}
          />
          Upload Collection Cover
        </Button>
      </div>
    </div>
  );
};
export default CollectionStep2;