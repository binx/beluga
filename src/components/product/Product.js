import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import withWidth, { isWidthUp } from '@material-ui/core/withWidth';
import { withRouter } from "react-router-dom";

import PageWrapper from '../ui/PageWrapper';
import ProductDetails from './ProductDetails';
import Carousel from '../ui/Carousel';
import MobileCarousel from '../ui/MobileCarousel';
import Breadcrumb from '../ui/Breadcrumb';
import Paper from '@material-ui/core/Paper';

const Wrapper = styled.div `
  padding: 40px;
  @media (max-width: 650px) {
    padding: 20px;
  }
`;
const Grid = styled.div `
  display: grid;
  grid-template-columns: repeat(${props => props.numColumns}, 1fr);
  grid-gap: 40px;
  width: ${props => props.numColumns === 2 ? "50%" : "100%"};
  margin: 0 auto;
  @media (max-width: 650px) {
    grid-template-columns: repeat(1, 1fr);
    grid-gap: 40px 0;
  }
`;

function Product(props) {
  const { product, config } = props;
  const isValidVariant = product.details && product.details.name.length && product.details.options.length;

  const initialVariants = isValidVariant ? [product.details] : [];
  const [quantity, setQuantity] = useState(1);
  const [variants, setVariants] = useState(initialVariants);
  const [sku_id, setSkuID] = useState();
  const [inventory, setInventory] = useState();
  const [price, setPrice] = useState();

  useEffect(() => {
    if (!product.stripe_id) return;

    fetch(`/product-info/${product.stripe_id}`)
      .then(res => res.json())
      .then(result => {
        if (result.data && result.data.length >= 1) {
          const attr = Object.keys(result.data[0].attributes)[0]
          const product_skus = {
            "name": attr,
            "options": result.data.map(sku => ({
              sku_id: sku.id,
              price: sku.price / 100,
              inventory: sku.inventory,
              label: sku.attributes[attr]
            }))
          }
          const newVariants = [...variants]
          newVariants.unshift(product_skus)
          setVariants(newVariants);

          const defaultChoice = product_skus.options[0];
          setSkuID(defaultChoice.sku_id);
          setInventory(defaultChoice.inventory);
          setPrice(defaultChoice.price);

        } else {
          setSkuID(result.data[0].id);
          setInventory(result.data[0].inventory);
          setPrice(result.data[0].price / 100);
        }
      }).catch(error => console.error('Error:', error));

  }, [props.product.stripe_id]);

  const updateSkuPrice = (newSkuID, newPrice, newInventory) => {
    setSkuID(newSkuID);
    setPrice(newPrice);
    setInventory(JSON.parse(newInventory));
  }

  const addToCart = order => {

    let attr = {};
    variants && variants.forEach(key => {
      const name = key.name;
      if (order[name])
        attr[name] = order[name]
      else {
        const defaultChoice = variants.find(v => v.name === name).options[0].label;
        attr[name] = defaultChoice;
      }
    });

    const slug = `${config.store_slug}_products`;
    let products = JSON.parse(localStorage.getItem(slug));
    products = Array.isArray(products) ? products : [];

    const item = {
      url: `/product/${product.url}`,
      name: product.name,
      sku_id,
      price,
      attr,
      quantity
    };
    if (product.photos && !!product.photos.length)
      item["img"] = `${process.env.PUBLIC_URL}/assets/${product.stripe_id}/${product.photos[0].name}`;

    products.push(item)
    localStorage.setItem(slug, JSON.stringify(products));
    props.updateNumber(products.length)
    props.history.push("/cart");
  }

  let photos;
  const hasPhotos = product.photos && !!product.photos.length;
  if (hasPhotos && isWidthUp('sm', props.width)) {
    photos = <Carousel photos={product.photos} stripe_id={product.stripe_id} />;
  } else if (hasPhotos) {
    photos = <MobileCarousel photos={product.photos} stripe_id={product.stripe_id} />;
  }

  let collection;
  if (props.location.state && props.location.state.collection)
    collection = props.location.state.collection;

  return (
    <PageWrapper>
      <Paper>
        <Wrapper>
          <Breadcrumb product={product} collection={collection} />
          <Grid numColumns={hasPhotos ? (product.photos.length > 1 ? 5 : 4) : 2}>
            {photos}
            <div style={{ gridColumn: "span 2" }}>
              <ProductDetails
                product={product}
                quantity={quantity}
                inventory={inventory}
                setQuantity={setQuantity}
                variants={variants}
                price={price}
                updateSkuPrice={updateSkuPrice}
                addToCart={addToCart}
              />
            </div>
          </Grid>
        </Wrapper>
      </Paper>
    </PageWrapper>
  );
};
export default withWidth()(withRouter(Product));