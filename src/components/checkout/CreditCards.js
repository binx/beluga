import React, { useState } from 'react';
import {
  CardElement,
  Elements,
  injectStripe
} from 'react-stripe-elements';

import Button from '@material-ui/core/Button';

const createOptions = (fontSize) => {
  return {
    style: {
      base: {
        fontSize,
        color: '#222',
        letterSpacing: '0.025em',
        fontFamily: 'Raleway, sans-serif',
        fontWeight: '100',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#9e2146',
      },
    },
  };
};

function _CardForm(props) {
  const [disabled, setDisabled] = useState(false);

  const handleSubmit = event => {
    event.preventDefault();
    props.stripe.createToken()
      .then(payload => {
        setDisabled(true);
        props.setToken(payload.token.id)
      });
  };
  return (
    <form onSubmit={handleSubmit}>
      <label>
        <CardElement
          {...createOptions(props.fontSize)}
        />
      </label>
      <Button variant="contained" color="primary" 
        disabled={disabled} onClick={handleSubmit}
      >
        Complete Order
      </Button>
    </form>
  );
}
const CardForm = injectStripe(_CardForm);

function CreditCard(props) {
  const [elementFontSize, setElementFontSize] = useState(window.innerWidth < 450 ? '14px' : '18px')

  window.addEventListener('resize', () => {
    if (window.innerWidth < 450 && this.state.elementFontSize !== '14px') {
      setElementFontSize('14px')
    } else if (
      window.innerWidth >= 450 &&
      elementFontSize !== '18px'
    ) {
      setElementFontSize('18px')
    }
  });

  return (
    <div className="Checkout">
      <Elements>
        <CardForm fontSize={elementFontSize} setToken={props.setToken} />
      </Elements>
    </div>
  );
}
export default CreditCard;