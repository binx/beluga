import React, { useState } from 'react';
import { withRouter } from "react-router-dom";

import { Paper, Grid } from '@material-ui/core';

import CheckoutHeader from './CheckoutHeader';
import Email from './Email';
import Shipping from './Shipping';
import ShippingOptions from "./ShippingOptions";
import CreditCards from './CreditCards';

function CheckoutFlow(props) {
  const { classes, slug, items, shippingOption, setShippingOption, displayShippingOptions } = props;

  const [pane, setPane] = useState(0);
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState({});
  const [orderID, setOrderID] = useState();
  const [error, setError] = useState();

  const createOrder = () => {
    const orderItems = items.map(i => ({ type: 'sku', parent: i.sku_id, quantity: +i.quantity }));

    let metadata = { status: "Ordered" };
    items.forEach((item, index) => {
      metadata[`order-${index}-${item.sku_id}`] = JSON.stringify(item.attr);
    });

    if (shippingOption.price > 0)
      orderItems.push({
        type: 'sku',
        parent: shippingOption.id,
        quantity: 1,
        description: `Shipping (${shippingOption.name})`
      });

    const postBody = {
      items: orderItems,
      metadata: metadata,
      shipping: {
        name: `${address.givenName} ${address.familyName}`,
        address: {
          line1: address.address1,
          line2: address.address2,
          city: address.locality,
          state: address.region,
          country: 'US',
          postal_code: address.postalCode
        }
      },
      email: email
    };

    fetch("/order/create", {
        method: 'POST',
        headers: new Headers({ 'content-type': 'application/json' }),
        body: JSON.stringify(postBody)
      }).then((response) => response.json())
      .then((json) => {
        setOrderID(json.id);
        setPane(3);
      })
  }

  const setToken = token => {
    if (!orderID) {
      setError(true)
      return;
    }
    fetch("/order/pay", {
        method: 'POST',
        headers: new Headers({ 'content-type': 'application/json' }),
        body: JSON.stringify({
          id: orderID,
          source: token
        })
      }).then((response) => response.json())
      .then((order) => {
        props.updateNumber(0);
        localStorage.setItem(slug, JSON.stringify([]));

        props.history.push({
          pathname: '/confirm',
          state: { order }
        });
      })
  }

  let displayAddress;
  if (address.postalCode) {
    displayAddress = (
      <div className={classes.inputInfo}>
          <div>{address.givenName} {address.familyName}</div>
          <div>{address.address1}</div>
          <div>{address.address2}</div>
          <div>{address.locality}, {address.region}</div>
          <div>{address.postalCode}</div>
        </div>
    );
  }
  const displayShippingOption = shippingOption ? `${shippingOption.name} — ${(shippingOption.price/100).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}` : "";

  return (
    <Grid item md={8} xs={12}>
      <Paper className={classes.paper}>
        <CheckoutHeader text={"Your Email"} classes={classes.heading}
          pane={0} currentPane={pane}
          changePane={() => setPane(0)}
        />
        { pane === 0 ? (
          <Email
            email={email} 
            handleChange={setEmail}
            changePane={() => setPane(1)}
          />
        ) : (
          <div className={classes.inputInfo}>
            {email}
          </div>
        )}
      </Paper>
      <Paper className={classes.paper}>
        <CheckoutHeader text={"Shipping Address"} classes={classes.heading}
          pane={1} currentPane={pane}
          changePane={() => setPane(1)}
        />
        { pane === 1 ? (
          <Shipping
            address={address}
            setAddress={setAddress}
            changePane={() => setPane(2)}
          />
        ) : displayAddress}
      </Paper>
      <Paper className={classes.paper}>
        <CheckoutHeader text={"Shipping Options"} classes={classes.heading}
          pane={2} currentPane={pane}
          changePane={() => setPane(2)}
        />
        { pane === 2 && (
          <ShippingOptions
            changePane={() => setPane(3)}
            options={displayShippingOptions}
            shippingOption={shippingOption}
            setShippingOption={setShippingOption}
            createOrder={createOrder}
          />
        )}
        { pane === 3 && (
          <div className={classes.inputInfo}>
            {displayShippingOption}
          </div>
        )}
      </Paper>
      <Paper className={classes.paper}>
        <CheckoutHeader text={"Payment"} classes={classes.heading}
          pane={3} currentPane={pane}
          changePane={() => setPane(3)}
        />
        { error &&
          <p style={{ color: "#f40" }}>Sorry, an error has occurred. Please refresh the page and try again.</p>
        }
        { !error && pane === 3 && (
          <CreditCards setToken={setToken} />
        )}
      </Paper>
    </Grid>
  );
}
export default withRouter(CheckoutFlow);