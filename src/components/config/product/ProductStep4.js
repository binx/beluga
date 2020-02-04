import React from 'react';
import styled from "styled-components";
import DragSortableList from 'react-drag-sortable';
import { getAspect } from "../../../util";

import { Button, IconButton } from "@material-ui/core";
import { DeleteForever, DragIndicator } from '@material-ui/icons';

const Wrapper = styled.div `
  display: flex;
  flex-direction: column;
  margin: 20px 0 40px;
`;
const IMGWrapper = styled.div `
  position: relative;
  margin-right: 10px;

  .delete, .drag-handle {
    position: absolute;
    z-index: 1;
    top: 5px;
    display: none;
  }
  .drag-handle {
    left: 5px;
  }
  .delete {
    right: 5px;
  }
  &:hover .delete, &:hover .drag-handle {
    display: block; 
    background-color: rgba(255,255,255,.9);
  }
`;
const IMG = styled.div `
  width: 100%;
  height: 100%;
  background-color: #eee;
  background-size: cover;
  background-repeat: no-repeat;
  display: inline-block;
  background-position: 50%;
`;

function ProductStep4(props) {
  const { product, handleChange, saveConfig } = props;
  const { photos = [] } = product;

  const uploadImage = event => {
    const formData = new FormData()
    // removing all special characters except the last period
    let filename = event.target.files[0].name.replace(/[.](?=.*[.])/g, "").replace(/[^a-zA-Z0-9-_.]/g, '')
    formData.append("file", event.target.files[0], filename)

    fetch(`/upload-image/${product.stripe_id}`, {
        method: 'POST',
        body: formData
      }).then(response => response.json())
      .then(result => {
        if (!result.success) return;

        const photoArray = [...photos];
        photoArray.push({
          name: filename,
          width: result.width,
          height: result.height
        });
        handleChange("photos", photoArray)
        saveConfig();
      })
      .catch(error => console.log(error));
  };

  const deleteImage = (name, index) => {
    fetch(`/delete-image/${product.stripe_id}/${name}`, {
        method: 'GET'
      }).then(response => response.json())
      .then(result => {
        if (!result.success) return;

        const photoArray = [...photos];
        photoArray.splice(index, 1);
        handleChange("photos", photoArray)
        saveConfig();
      })
      .catch(error => console.log(error));
  }

  const onSort = list => {
    const sorted = list.sort((a, b) => a.rank - b.rank).map(p => p.photo);
    handleChange("photos", sorted)
    saveConfig();
  }

  const list = photos.map((p, i) => {
    const aspect = getAspect(p);
    return ({
      content: (
        <IMGWrapper key={`image${i}`} 
          style={{
            width: aspect !== "vertical" ? 200 : 150,
            height: aspect !== "horizontal" ? 200 : 150,
            marginTop: aspect !== "horizontal" ? 0 : 25
          }}
        >
          <IMG style={{ backgroundImage: `url("${process.env.PUBLIC_URL}/assets/${product.stripe_id}/${p.name}")` }}/>
          <IconButton
            color="inherit" aria-label="Delete"
            className="drag-handle"
          >
            <DragIndicator />
          </IconButton>
          <IconButton
            color="inherit" aria-label="Delete"
            className="delete no-drag"
            onClick={() => deleteImage(p,i.name)}
          >
            <DeleteForever />
          </IconButton>
        </IMGWrapper>
      ),
      photo: p
    })
  })

  return (
    <Wrapper>
      <DragSortableList items={list} onSort={onSort} type="horizontal" />
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
          Upload Image
        </Button>
      </div>
    </Wrapper>
  );
};
export default ProductStep4;