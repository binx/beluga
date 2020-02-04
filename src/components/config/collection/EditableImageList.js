import React from 'react';
import styled from "styled-components";
import DragSortableList from 'react-drag-sortable';

import { IconButton } from "@material-ui/core";
import { DeleteForever, DragIndicator } from '@material-ui/icons';

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
  background-color: #eee;
  width: 125px;
  height: 125px;
  background-size: cover;
  background-repeat: no-repeat;
  display: inline-block;
  background-position: 50%;
`;

const EditableImageList = ({ storeConfig, products, handleChange }) => {

  const onSort = list => {
    const sorted = list.sort((a, b) => a.rank - b.rank)
      .map(p => p.product.stripe_id);
    handleChange("products", sorted)
  }

  const removeProduct = i => {
    let newProducts = [...products];
    newProducts.splice(i, 1);
    handleChange("products", newProducts)
  }

  const imageList = [...products].map((id, i) => {
    const product = storeConfig.products.find(p => p.stripe_id === id);

    if (!product) return (null);

    const img_url = product.photos && !!product.photos.length ?
      `url("${process.env.PUBLIC_URL}/assets/${id}/${product.photos[0].name}")` :
      null;

    return ({
      content: (
        <IMGWrapper key={`image${i}`}>
          <IMG style={{ backgroundImage: img_url }} />
          <div style={{ fontSize: "12px" }}>{product.name}</div>
          <IconButton
            color="inherit" aria-label="Delete"
            className="drag-handle"
          >
            <DragIndicator />
          </IconButton>
          <IconButton
            color="inherit" aria-label="Delete"
            className="delete no-drag"
            onClick={() => removeProduct(i)}
          >
            <DeleteForever />
          </IconButton>
        </IMGWrapper>
      ),
      product
    })
  })

  return (
    <div style={{ minHeight: imageList.length ? "150px" : 0, margin: "20px 0" }}>
      <DragSortableList items={imageList} onSort={onSort} type="horizontal" />
    </div>
  );
};
export default EditableImageList;