import React from 'react';
import { withRouter } from "react-router-dom";

import PageWrapper from '../ui/PageWrapper';
import Paper from '@material-ui/core/Paper';

const Confirm = props => (
  <PageWrapper>
    <Paper style={{ padding: "40px", minHeight: "500px" }}>
      <h2 style={{ marginTop: 0, fontWeight: 600 }}>Thank you for your purchase!</h2>
      <p>A confirmation email has been sent to <b>{props.location.state.order.email}</b>.</p>
      <p>Order ID: {props.location.state.order.id.split("_")[1]}</p>
    </Paper>
  </PageWrapper>
);
export default withRouter(Confirm);