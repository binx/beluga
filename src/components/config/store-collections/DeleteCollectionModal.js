import React from 'react';

import { Button, Dialog, DialogActions, DialogTitle, DialogContent, DialogContentText } from '@material-ui/core';

function DeleteCollectionModal(props) {
  const { modalOpen, modalCollection, storeConfig } = props;

  const deleteCollection = () => {
    fetch(`/delete-collection/${modalCollection.id}`, {
        method: 'POST',
        headers: new Headers({ 'content-type': 'application/json' })
      }).then((response) => response.json())
      .then((json) => {
        // error that is not a missing ID
        if (json.code && json.code !== "resource_missing") {
          console.log(json)
          return;
        }

        let newCollections = [...storeConfig.collections];
        const collectionIndex = newCollections.findIndex(p => p.id === modalCollection.id)
        newCollections.splice(collectionIndex, 1);
        props.handleChange("collections", newCollections, true, true);
        props.setModalCollection(null);
        props.setModalOpen(false);
      })
  }

  return (
    <Dialog
      open={modalOpen}
      onClose={() => props.setModalOpen(false)}
    >
      <DialogTitle>Delete Collection</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Are you sure you want to delete <b>{modalCollection && modalCollection.name}</b>? This cannot be undone.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => props.setModalOpen(false)} color="primary">
          Cancel
        </Button>
        <Button onClick={deleteCollection} color="primary" autoFocus>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};
export default DeleteCollectionModal;