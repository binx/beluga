import React, { useState, useEffect } from 'react';
// import styled from 'styled-components';

import PageWrapper from './ui/PageWrapper';
import Paper from '@material-ui/core/Paper';

function AboutPage(props) {
  const [aboutText, setAboutText] = useState("");

  useEffect(() => {
    fetch('/about-text/')
      .then(res => res.json())
      .then(results => {
        if (results.error) return;
        else setAboutText(results);
      })
  }, []);
  return (
    <PageWrapper>
      <Paper style={{ padding: "40px" }}>
        <h2 style={{ marginTop: 0, fontWeight: 600 }}>About</h2>
        { aboutText.split('\n').map((item, i) => (
          <p key={i}>{item}</p>
        ))}
      </Paper>
    </PageWrapper>
  );
}

export default AboutPage;