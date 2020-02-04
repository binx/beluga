import React, { useState, useEffect } from 'react';
import { withStyles } from '@material-ui/core/styles';

import PageWrapper from '../ui/PageWrapper';
import { Paper, Grid } from '@material-ui/core';

import CartSmall from '../cart/CartSmall';
import CheckoutFlow from "./CheckoutFlow";

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: 12 * 2,
    color: theme.palette.text.secondary,
    marginBottom: "20px"
  },
  inputInfo: {
    fontSize: "16px",
    marginTop: "20px",
    color: "black"
  }
});

function Checkout(props) {
  const { classes, config } = props;
  const slug = `${config.store_slug}_products`;
  const parsedItems = JSON.parse(localStorage.getItem(slug));
  const items = parsedItems ? parsedItems : [];

  const [displayShipping, setDisplayShipping] = useState([]);
  const [shippingOption, setShippingOption] = useState();

  useEffect(() => {
    if (!config.shipping_id) {
      setFreeShipping();
      return;
    }

    fetch(`/product-info/${config.shipping_id}`)
      .then(res => res.json())
      .then(result => {
        if (!result.data.length) {
          setFreeShipping();
          return;
        }
        const newOptions = result.data.map(sku => ({
          id: sku.id,
          price: sku.price,
          name: sku.attributes["type"]
        }))
        setDisplayShipping(newOptions);
      })
  }, []);

  const setFreeShipping = () => {
    const free = { "name": "FREE", "price": 0 };
    setDisplayShipping([free]);
    setShippingOption(free);
  }

  return (
    <PageWrapper>
      <Grid container className={classes.root} spacing={10} direction={'row-reverse'}>
        <Grid item md={4} xs={12}>
          <Paper className={classes.paper}>
            <CartSmall
              items={items}
              config={config}
              shippingOption={shippingOption}
            />
          </Paper>
        </Grid>
        <CheckoutFlow
          classes={classes}
          slug={slug}
          items={items}
          shippingOption={shippingOption}
          setShippingOption={setShippingOption}
          displayShippingOptions={displayShipping}
          updateNumber={props.updateNumber}
        />
      </Grid>
    </PageWrapper>
  );
}
export default withStyles(styles)(Checkout);