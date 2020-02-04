import React from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

const Email = ({ email, changePane, handleChange }) => {
  return (
    <div>
      <TextField
        autoComplete="email"
        label="Email Address"
        value={email}
        onChange={(e) => handleChange(e.target.value)}
        margin="normal"
        fullWidth
      />
      <p style={{ fontSize: "12px"}}>You will receive a receipt at this email address. We will never share your email with a 3rd party.</p>
      <Button variant="contained" color="primary"
        style={{ marginTop: "20px" }}
        disabled={!email.length}
        onClick={changePane}
      >
        Continue
      </Button>
    </div>
  );
}
export default Email;