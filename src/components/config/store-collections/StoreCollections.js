import React, { useState } from 'react';
import { Link } from "react-router-dom";

import CollectionDisplay from "./CollectionDisplay";
import DeleteCollectionModal from "./DeleteCollectionModal";
import ReorderCollectionsModal from "./ReorderCollectionsModal";

import { Button } from '@material-ui/core';

function StoreCollections({ storeConfig, handleChange }) {

  const [modalOpen, setModalOpen] = useState(false);
  const [modalCollection, setModalCollection] = useState();
  const [reorderModalOpen, setReorderModalOpen] = useState(false);

  if (!storeConfig) return (null)

  return (
    <div>
      <div style={{ marginBottom: "40px" }}>
        <Link to="/config/collection/new" style={{ textDecoration: "none" }}>
          <Button variant="contained" color="secondary">
            Create New Collection
          </Button>
        </Link>
        { storeConfig.collections.length > 2 && (
          <Button
            variant="outlined" color="primary"
            style={{ marginLeft: "20px" }}
            onClick={() => setReorderModalOpen(true)}
          >
            Reorder Collections
          </Button>
        )}
      </div>

      <p style={{ fontSize: "14px"}}>Featured Products is the collection that will display on your store's landing page.</p>

      <p style={{ fontSize: "14px"}}>If you add additional collections, <Link to="/shop" style={{ color: "black", fontWeight: "bold", textDecorationColor: storeConfig.colors.primary.main}}>/shop</Link> will display a list of collections. Otherwise, it will show a list of all products.</p>

      { storeConfig.collections.map((c,i) => (
        <CollectionDisplay
          c={c} key={`collection${i}`}
          storeConfig={storeConfig}
          setModalCollection={setModalCollection}
          setModalOpen={setModalOpen}
        />
      ))}

      <DeleteCollectionModal
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        modalCollection={modalCollection}
        storeConfig={storeConfig}
        handleChange={handleChange}
        setModalCollection={setModalCollection}
      />
      <ReorderCollectionsModal
        modalOpen={reorderModalOpen}
        setModalOpen={setReorderModalOpen}
        storeConfig={storeConfig}
        handleChange={handleChange}
      />
    </div>
  );
};
export default StoreCollections;