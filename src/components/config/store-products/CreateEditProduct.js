import React, { useState, useEffect } from 'react';
import { withRouter } from "react-router-dom";
import { leaf } from "../../../util";

import { useSelector, useDispatch } from "react-redux";

import CreateEditSteps from "./CreateEditSteps";

import PageWrapper from '../../ui/PageWrapper';
import { Paper } from "@material-ui/core";

function CreateEditProduct(props) {
  const initialProduct = props.product || {
    name: "",
    is_live: false
  };

  const [activeStep, setActiveStep] = useState(0);
  const [product, setProduct] = useState(initialProduct);
  const [skus, setSkus] = useState([]);

  const config = useSelector(state => state.reducers.config);
  const dispatch = useDispatch();

  useEffect(() => {
    if (props.history.location.search.length)
      setActiveStep(+props.history.location.search.split("=")[1])
  }, [])

  useEffect(() => {
    props.history.push({ search: `step=${activeStep}` })
  }, [activeStep])

  const handleNext = () => {
    if (activeStep === 0) {
      if (product.stripe_id) {
        updateProduct("name");
      } else
        createProduct();
    } else if (activeStep === 1 && product.attributes) {
      updateProduct("attributes");
    } else if (activeStep === 2) {
      updateSKUs();
    } else {
      saveAndAdvance();
    }
  };

  const saveAndAdvance = () => {
    setActiveStep(prevActiveStep => prevActiveStep + 1);
    saveConfig();
  }

  const createProduct = () => {
    let postProduct = {
      name: product.name
    }

    fetch('/create-product', {
        method: 'POST',
        headers: new Headers({ 'content-type': 'application/json' }),
        body: JSON.stringify(postProduct)
      }).then(response => response.json())
      .then(newProduct => {
        if (!newProduct.id) return;
        handleChange("stripe_id", newProduct.id)
        handleChange("created", newProduct.created)
        saveAndAdvance();
      })
      .catch(error => console.log(error));
  }
  const updateProduct = key => {
    const postProduct = {
      [key]: product[key]
    };
    fetch(`/update-product/${product.stripe_id}`, {
        method: 'POST',
        headers: new Headers({ 'content-type': 'application/json' }),
        body: JSON.stringify(postProduct)
      }).then(response => response.json())
      .then(result => {
        if (!result.success) return;
        saveAndAdvance();
      })
  }
  const updateSKUs = () => {
    if (skus.length === 1 && !skus[0].id) {
      fetch("/create-sku/", {
          method: 'POST',
          headers: new Headers({ 'content-type': 'application/json' }),
          body: JSON.stringify({
            price: skus[0].price,
            inventory: skus[0].inventory,
            product_id: product.stripe_id
          })
        }).then((response) => response.json())
        .then((json) => {
          if (!json.id) {
            console.log("error")
            return;
          }
          const newSkus = [...skus];
          newSkus[0]["id"] = json.id;
          setSkus(newSkus);
          setActiveStep(prevActiveStep => prevActiveStep + 1);
        });
    } else {
      Promise.all(skus.map(updateSKU))
        .then(() => {
          setActiveStep(prevActiveStep => prevActiveStep + 1);
        });
    }
  }

  const updateSKU = s => {
    return new Promise(function(resolve, reject) {
      fetch(`/update-sku/${s.id}`, {
          method: 'POST',
          headers: new Headers({ 'content-type': 'application/json' }),
          body: JSON.stringify({
            price: s.price,
            inventory: s.inventory
          })
        }).then((response) => response.json())
        .then((json) => {
          if (!json.success) reject();
          resolve(true);
        });
    });
  }

  const saveConfig = () => {
    let newProducts = [...config.products];
    const productIndex = newProducts.findIndex(p => p.stripe_id === product.stripe_id)
    if (productIndex !== -1) newProducts[productIndex] = product;
    else newProducts.unshift(product);

    dispatch({ type: "SET_PRODUCTS", products: newProducts })
    const newConfig = Object.assign({ ...config }, { products: newProducts });

    fetch("/config", {
        method: 'POST',
        headers: new Headers({ 'content-type': 'application/json' }),
        body: JSON.stringify(newConfig)
      }).then((response) => response.json())
      .then(result => {
        if (!result.success) console.log("error")

        if (props.history.location.pathname !== `/config/product/${product.url}`) {
          props.history.push({
            pathname: `/config/product/${product.url}`,
            search: `step=${activeStep+1}`
          })
        }
      });
  }

  const handleChange = (name, value) => {
    const update = leaf(product, name, value);
    const newProduct = Object.assign({ ...product }, update);
    setProduct(newProduct);
  }

  return (
    <PageWrapper>
      <Paper style={{ position: "relative", padding: "40px" }}>
        <CreateEditSteps
          product={product}
          skus={skus}
          setSkus={setSkus}
          handleChange={handleChange}
          activeStep={activeStep}
          setActiveStep={setActiveStep}
          handleNext={handleNext}
          saveConfig={saveConfig}
        />
      </Paper>
    </PageWrapper>
  );
};
export default withRouter(CreateEditProduct);