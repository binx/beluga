import React from 'react';

import { Button, Dialog, DialogActions, DialogTitle, DialogContent, DialogContentText } from '@material-ui/core';

function DeleteProductModal(props) {
  const { modalOpen, modalProduct, products } = props;

  const startDeletingProduct = () => {
    fetch(`/product-info/${modalProduct.stripe_id}`)
      .then(res => res.json())
      .then(result => {
        if (result.data && result.data.length) {
          Promise.all(result.data.map(d => deleteSKU(d.id)))
            .then(() => {
              deleteProduct();
            });
        } else {
          deleteProduct();
        }
      })
  }

  const deleteSKU = (id) => {
    return new Promise(function(resolve, reject) {
      fetch(`/delete-sku/${id}`, {
          method: 'POST',
          headers: new Headers({ 'content-type': 'application/json' })
        }).then((response) => response.json())
        .then((json) => {
          if (!json.success) reject();
          resolve(true);
        });
    });
  }

  const deleteProduct = () => {
    fetch(`/delete-product/${modalProduct.stripe_id}`, {
        method: 'POST',
        headers: new Headers({ 'content-type': 'application/json' })
      }).then((response) => response.json())
      .then((json) => {
        // error that is not a missing ID
        if (json.code && json.code !== "resource_missing") {
          console.log(json)
          return;
        }

        const newProducts = [...products];
        const index = newProducts.findIndex(p => p.stripe_id === modalProduct.stripe_id)
        newProducts.splice(index, 1);
        props.handleChange("products", newProducts, true);
        props.setModalProduct(null);
        props.setModalOpen(false);
      });
  }

  return (
    <Dialog
      open={modalOpen}
      onClose={() => props.setModalOpen(false)}
    >
      <DialogTitle>Delete Product</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Are you sure you want to delete <b>{modalProduct && modalProduct.name}</b>? This cannot be undone.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => props.setModalOpen(false)} color="primary">
          Cancel
        </Button>
        <Button onClick={startDeletingProduct} color="primary" autoFocus>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};
export default DeleteProductModal;