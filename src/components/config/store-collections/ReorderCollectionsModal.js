import React, { useState } from 'react';
import styled from "styled-components";
import DragSortableList from 'react-drag-sortable';

import { Button, Dialog, DialogActions, DialogTitle, DialogContent } from '@material-ui/core';
import { DragIndicator } from '@material-ui/icons';

const Flex = styled.div `
  display: flex;
  align-items: center;
  border-top: 1px solid #ccc;
  border-bottom: 1px solid #ccc;
  padding: 10px 0;
  min-width: 500px;
  margin-top: -1px;
  background-color: white;
  cursor: pointer;
  &:hover {
    background-color: #f7f7f7;
  }
`;

function ReorderCollectionsModal(props) {
  const { collections = [] } = props.storeConfig;
  const displayCollections = [...collections].filter(c => c.url !== "featured-products");
  const [stateCollections, setStateCollections] = useState(displayCollections)

  const onSort = list => {
    const sorted = list.sort((a, b) => a.rank - b.rank)
      .map(p => p.collection);
    setStateCollections(sorted);
  }

  const saveOrder = () => {
    const featured = collections.find(c => c.url === "featured-products")
    props.handleChange("collections", [featured, ...stateCollections], true, true);
    props.setModalOpen(false);
  }

  const collectionList = [...stateCollections]
    .map((c, i) => ({
      content: (
        <Flex key={`image${i}`}>
          <DragIndicator />
          <div>{c.name}</div>
        </Flex>
      ),
      collection: c
    }));

  return (
    <Dialog
      open={props.modalOpen}
      onClose={() => props.setModalOpen(false)}
    >
      <DialogTitle>Order Collections</DialogTitle>
      <DialogContent>
        <DragSortableList items={collectionList} onSort={onSort} type="vertical" />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => props.setModalOpen(false)} color="primary">
          Cancel
        </Button>
        <Button onClick={saveOrder} color="primary" autoFocus>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};
export default ReorderCollectionsModal;