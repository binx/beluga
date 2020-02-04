import React, { useState, useEffect } from 'react';
import { withRouter } from "react-router-dom";
import { leaf } from "../../util";

import { useSelector, useDispatch } from "react-redux";

import Theme from "./Theme";
import StoreProducts from "./store-products/StoreProducts";
import StoreCollections from "./store-collections/StoreCollections";
import Settings from "./Settings";
import AboutPage from "./AboutPage";

import PageWrapper from '../ui/PageWrapper';
import { Paper, Tabs, Tab, Box, Typography } from '@material-ui/core';


function ConfigPage(props) {
  const config = useSelector(state => state.reducers.config);
  const [storeConfig, setStoreConfig] = useState(config);
  const [tab, setTab] = useState(0);
  const dispatch = useDispatch();

  useEffect(() => {
    // go to proper tab on reload
    if (props.history.location.search.length)
      setTab(+props.history.location.search.split("=")[1])
  }, [])

  const handleChange = (name, value, autoUpdate, refreshPage) => {
    const update = leaf(storeConfig, name, value);
    const newConfig = Object.assign({ ...storeConfig }, update);
    setStoreConfig(newConfig);

    if (autoUpdate) updateStoreConfig(newConfig, refreshPage)
  }

  const updateStoreConfig = (newConfig, refreshPage) => {
    const postConfig = newConfig || storeConfig;

    fetch("/config", {
        method: 'POST',
        headers: new Headers({ 'content-type': 'application/json' }),
        body: JSON.stringify(postConfig)
      }).then((response) => response.json())
      .then(result => {
        if (result.success && refreshPage)
          dispatch({ type: "SET_CONFIG", config: postConfig })
      });
  }

  return (
    <PageWrapper>
      <Paper style={{ position: "relative", padding: "40px" }}>

        <Tabs value={tab} onChange={(e,v) => {
          setTab(v);
          props.history.push({ search: `tab=${v}` })
        }}>
          <Tab label="Products" {...a11yProps(0)} />
          <Tab label="Collections" {...a11yProps(1)} />
          <Tab label="Theme" {...a11yProps(2)} />
          <Tab label="About" {...a11yProps(3)} />
          <Tab label="Settings" {...a11yProps(4)} />
        </Tabs>

        <TabPanel value={tab} index={0}>
          <StoreProducts
            storeConfig={storeConfig}
            handleChange={handleChange}
            updateStoreConfig={updateStoreConfig}
          />
        </TabPanel>
        <TabPanel value={tab} index={1}>
          <StoreCollections
            storeConfig={storeConfig}
            handleChange={handleChange}
            updateStoreConfig={updateStoreConfig}
          />
        </TabPanel>
        <TabPanel value={tab} index={2}>
          <Theme
            storeConfig={storeConfig}
            handleChange={handleChange}
            updateStoreConfig={updateStoreConfig}
          />
        </TabPanel>
        <TabPanel value={tab} index={3}>
          <AboutPage
            storeConfig={storeConfig}
            handleChange={handleChange}
          />
        </TabPanel>
        <TabPanel value={tab} index={4}>
          <Settings
            storeConfig={storeConfig}
            handleChange={handleChange}
            updateStoreConfig={updateStoreConfig}
          />
        </TabPanel>
      </Paper>
    </PageWrapper>
  );
};
export default withRouter(ConfigPage);

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </Typography>
  );
}