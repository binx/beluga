import React, { useState, useEffect } from 'react';
import { withRouter } from "react-router-dom";
import { leaf, generateID } from "../../../util";

import { useSelector, useDispatch } from "react-redux";

import CreateEditSteps from "./CreateEditSteps";

import PageWrapper from '../../ui/PageWrapper';
import { Paper } from "@material-ui/core";

function CreateEditCollection(props) {
  const initialCollection = props.collection || {
    name: "",
    id: generateID(5),
    products: []
  };

  const [activeStep, setActiveStep] = useState(0);
  const [collection, setCollection] = useState(initialCollection);
  const storeConfig = useSelector(state => state.reducers.config);
  const dispatch = useDispatch();

  useEffect(() => {
    if (props.history.location.search.length)
      setActiveStep(+props.history.location.search.split("=")[1])
  }, [])

  useEffect(() => {
    props.history.push({ search: `step=${activeStep}` })
  }, [activeStep])

  const handleChange = (name, value) => {
    const update = leaf(collection, name, value);
    const newCollection = Object.assign({ ...collection }, update);
    setCollection(newCollection);
  }

  const handleNext = () => {
    setActiveStep(prevActiveStep => prevActiveStep + 1);
    saveConfig();
  }

  const saveConfig = () => {
    let newCollections = [...storeConfig.collections];
    const collectionIndex = newCollections.findIndex(p => p.id === collection.id)
    // either update, or add into array position 1, after featured-products
    if (collectionIndex !== -1) newCollections[collectionIndex] = collection;
    else newCollections.splice(1, 0, collection);

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
        if (props.history.location.pathname !== `/config/collection/${collection.url}`) {
          props.history.push({
            pathname: `/config/collection/${collection.url}`,
            search: `step=${activeStep+1}`
          })
        }
      });
  }

  if (!storeConfig) return (null);

  return (
    <PageWrapper>
      <Paper style={{ position: "relative", padding: "40px" }}>
        <CreateEditSteps
          collection={collection}
          storeConfig={storeConfig}
          saveConfig={saveConfig}
          handleChange={handleChange}
          activeStep={activeStep}
          setActiveStep={setActiveStep}
          handleNext={handleNext}
        />
      </Paper>
    </PageWrapper>
  );
};
export default withRouter(CreateEditCollection);