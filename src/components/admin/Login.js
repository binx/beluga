import React, { useState } from 'react';
import { withRouter } from "react-router-dom";

import { useDispatch } from "react-redux";

import PageWrapper from '../ui/PageWrapper';
import { Paper, TextField, Button } from '@material-ui/core';

function Login(props) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState();

  const dispatch = useDispatch();

  const logUserIn = () => {
    setError(null)
    fetch('/api/login', {
        method: 'POST',
        headers: new Headers({ 'content-type': 'application/json' }),
        credentials: 'same-origin',
        body: JSON.stringify({ password })
      })
      .then(res => res.json())
      .then(json => {
        if (json.isAdmin) {
          dispatch({ type: "SET_ADMIN", isAdmin: true })

          if (props.history.location.search)
            props.history.push(`/${props.history.location.search.split("?")[1]}`)
          else
            props.history.push("/orders");

        } else if (json.error)
          setError(json.error.message)
      });
  }

  return (
    <PageWrapper>
      <Paper style={{ padding: "40px" }}>
        <TextField
          label="Password"
          value={password}
          type="password"
          onChange={e => setPassword(e.target.value)}
          onKeyDown={e => {
            if (e.keyCode === 13) logUserIn()
          }}
        />
        <div style={{ margin: "20px 0" }}>
          <Button
            variant="contained" color="primary" 
            onClick={logUserIn}
          >
            Log In
          </Button>
        </div>
        <div>{error}</div>
      </Paper>
    </PageWrapper>
  );
};
export default withRouter(Login);