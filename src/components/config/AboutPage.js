import React, { useState } from 'react';
import { Link } from "react-router-dom";

import { Button, Switch, TextField } from '@material-ui/core';

function AboutPage(props) {
  const { storeConfig, handleChange } = props;
  const [aboutText, setAboutText] = useState("");
  const [savedToFile, setSavedToFile] = useState(false);

  useState(() => {
    if (!storeConfig.about_page) return;

    fetch('/about-text/')
      .then(res => res.json())
      .then(results => {
        if (results.error) return;
        else setAboutText(results);
      })
  }, [storeConfig.about_page])

  const saveText = () => {
    fetch("/about-text/", {
        method: 'POST',
        headers: new Headers({ 'content-type': 'application/json' }),
        body: JSON.stringify({ text: aboutText })
      }).then((response) => response.json())
      .then(result => {
        if (result.success)
          setSavedToFile(true);
      });
  }

  return (
    <div>
      <Switch size="small" 
        checked={storeConfig.about_page}
        onChange={e => handleChange("about_page", e.target.checked, true, true)}
      />
      Display an "About" Page
      { storeConfig.about_page && (
        <div>
          <TextField
            label="About Page Text"
            value={aboutText}
            multiline={true}
            onChange={(e) => {
              setAboutText(e.target.value)
              setSavedToFile(false);
            }}
            style={{ margin: "40px 0"}}
            variant="outlined"
            rows="3"
            fullWidth
          />
          { savedToFile ? (
            <Link to="/about" style={{ textDecoration: "none" }}>
              <Button variant="contained" color="secondary"
                onClick={saveText}
              >
                View On Site
              </Button>
            </Link>
          ) : (
            <Button variant="contained" color="primary"
              onClick={saveText}
            >
              Save
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
export default AboutPage;