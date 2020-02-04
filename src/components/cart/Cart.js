import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

import PageWrapper from '../ui/PageWrapper';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import CartTable from './CartTable';

const Wrapper = styled.div `
  padding: 40px;
  min-height: 500px;
  @media (max-width: 650px) {
    padding: 20px;
  }
`;
const RightSide = styled.div `
   display: flex;
   flex-direction: column;
   align-items: flex-end;
   margin-top: 40px;
`;
const Subtotal = styled.div `
  margin-bottom: 20px;
  > span {
    font-size: 14px;
    color: #888;
    margin-right: 15px;
  }
`;

function Cart(props) {
  const [items, setItems] = useState();
  const slug = `${props.config.store_slug}_products`;

  useEffect(() => {
    let newItems = JSON.parse(localStorage.getItem(slug));
    setItems(newItems ? newItems : [])
  }, []);

  const removeItem = index => {
    let newItems = [...items];
    newItems.splice(index, 1);
    props.updateNumber(newItems.length);
    setItems(newItems);
    localStorage.setItem(slug, JSON.stringify(newItems));
  }

  const updateCount = (index, value) => {
    let newItems = [...items];
    newItems[index].quantity = value;
    setItems(newItems);
    localStorage.setItem(slug, JSON.stringify(newItems));
  }

  let totalPrice;
  if (items && items.length) {
    totalPrice = items.map(i => (i.quantity * i.price))
      .reduce((a, b) => a + Number(b))
      .toLocaleString('en-US', { style: 'currency', currency: 'USD' })
  }

  return (
    <PageWrapper>
      <Paper>
        <Wrapper>
        <h2 style={{ marginTop: 0, fontWeight: 600 }}>Cart</h2>
          { items && items.length > 0 &&
            <div>
              <CartTable items={items}
                updateCount={updateCount}
                removeItem={removeItem}
                config={props.config}
              />
              <RightSide>
                <Subtotal>
                  <span>Subtotal</span>
                  {totalPrice}
                </Subtotal>
                <Link to={`/checkout`} style={{ textDecoration: "none" }}>
                  <Button variant="contained" color="primary">Check Out</Button>
                </Link>
              </RightSide>
            </div>
          }
          { items && items.length === 0 &&
            <p>Hmmmm, there's nothing in your cart yet.</p>
          }
        </Wrapper>
      </Paper>
    </PageWrapper>
  );
};
export default Cart;