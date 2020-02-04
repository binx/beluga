import React, { useState, useEffect } from 'react';

import { TextField, Button } from '@material-ui/core';

function Shipping(props) {
  const blankAddress = {
    givenName: "",
    familyName: "",
    address1: "",
    address2: "",
    locality: "",
    region: "",
    postalCode: ""
  }
  const [address, setAddress] = useState(blankAddress);

  useEffect(() => {
    if (Object.keys(props.address).length)
      setAddress(props.address);
  }, [props.address])

  const handleChange = (name, value) => {
    const newAddress = Object.assign({ ...address }, {
      [name]: value
    });
    setAddress(newAddress);
  }

  const submitAddress = () => {
    props.setAddress(address);
    props.changePane();
  }

  return (
    <div>
      <TextField
        autoComplete="given-name"
        label="First Name"
        value={address.givenName}
        onChange={(e) => handleChange('givenName', e.target.value)}
        margin="normal"
        style={{ marginRight: "50px" }}
      />
      <TextField
        autoComplete="family-name"
        label="Last Name"
        value={address.familyName}
        onChange={(e) => handleChange('familyName', e.target.value)}
        margin="normal"
      />

      <TextField
        autoComplete="shipping address-line1"
        label="Street Address"
        value={address.address1}
        onChange={(e) => handleChange('address1', e.target.value)}
        margin="normal"
        fullWidth
      />
      <TextField
        autoComplete="shipping address-line2"
        label="Apt, suite, etc (optional)"
        value={address.address2}
        onChange={(e) => handleChange('address2', e.target.value)}
        margin="normal"
        fullWidth
      />
      <TextField
        autoComplete="shipping locality"
        label="City"
        value={address.locality}
        onChange={(e) => handleChange('locality', e.target.value)}
        margin="normal"
        style={{ marginRight: "50px" }}
      />
      <TextField
        autoComplete="shipping region"
        label="State"
        value={address.region}
        onChange={(e) => handleChange('region', e.target.value)}
        margin="normal"
        style={{ marginRight: "50px" }}
      />
      <TextField
        autoComplete="shipping postal-code"
        label="Zip"
        value={address.postalCode}
        onChange={(e) => handleChange('postalCode', e.target.value)}
        margin="normal"
      />
      <div>
        <Button variant="contained" color="primary"
          style={{ marginTop: "40px" }}
          disabled={!address.postalCode.length}
          onClick={submitAddress}
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
export default Shipping;