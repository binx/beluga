import React from 'react';

import PageWrapper from './ui/PageWrapper';
import Paper from '@material-ui/core/Paper';

const NotFound404 = () => (
  <PageWrapper>
    <Paper style={{ padding: "40px" }}>
      <h1>404 Page Not Found</h1>
    </Paper>
  </PageWrapper>
);

export default NotFound404;