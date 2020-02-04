import React from 'react';
import styled from 'styled-components';
import Divider from '@material-ui/core/Divider';

const Wrapper = styled.div `
`;
const Row = styled.div `
  display: flex;
  justify-content: space-between;
  padding: 5px 0;
  text-transform: capitalize;
  font-size: 16px;
  .full {
    flex: 1;
    margin-left: 10px;
  }
  > span {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .black-text { color: #000; }
  .small-text { font-size: 14px; }
`;
const Image = styled.div `
  background-image: url(${props => props.img});
  background-color: #eee;
  width: 62px;
  height: 62px;
  background-size: cover;
  background-position: 50%;
`;

const CartSmall = ({ items, shippingOption }) => {
  let subtotal = 0;
  if (items.length) {
    subtotal = items.map(i => i.quantity * i.price)
      .reduce((a, b) => a + Number(b))
  }
  const total = shippingOption ? (subtotal + shippingOption.price / 100) : subtotal;

  return (
    <Wrapper>
      {items.map((d,i) => {
        let attrs = [];
        for (let key in d.attr) {
          attrs.push(`${key.replace("_", " ")}: ${d.attr[key]}`)
        }
        attrs = attrs.join(", ");

        return (
          <Row key={`cart${i}`}>
            <span>
              <Image img={d.img} />
            </span>
            <span className="full">
              <Row>
                <span className="black-text">{d.name}</span>
                <span>{d.quantity}</span>
              </Row>
              <div className="small-text">{attrs}</div>
            </span>
          </Row>
        );
      })}
      <Divider style={{ margin: "20px 0" }}/>
        <Row>
          <span className="small-text">Subtotal</span>
          <span className="black-text small-text">
            {subtotal.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
          </span>
        </Row>
        <Row>
          <span className="small-text">Shipping</span>
          { shippingOption && (
            <span className="black-text small-text">
              {shippingOption.price === 0 ? "FREE" : (shippingOption.price/100).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
            </span>
          )}
        </Row>
      <Divider style={{ margin: "20px 0" }}/>
        <Row>
          <span>Total</span>
          <span className="black-text">
            {total.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
          </span>
        </Row>
    </Wrapper>
  );
}
export default CartSmall;