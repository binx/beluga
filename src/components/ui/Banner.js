import React from 'react';
import { Link } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import withWidth, { isWidthDown } from '@material-ui/core/withWidth';

import { useSelector } from "react-redux";

import BannerHamburger from './BannerHamburger';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  buttons: {
    display: "flex",
    flex: 1
  },
  storeName: {
    color: theme.palette.secondary.contrastText,
    marginTop: "16px",
    display: "inline-block"
  },
  menuButton: {
    marginRight: "30px",
    textDecoration: "none",
    color: theme.palette.secondary.contrastText
  },
  appbar: {
    padding: "0 60px",
    [theme.breakpoints.down('md')]: {
      padding: "0 10px"
    }
  }
});

function Banner({ classes, quantity, config, width }) {
  const isAdmin = useSelector(state => state.reducers.isAdmin);

  const number = quantity ? ` (${quantity})` : "";

  let links = [{ url: "/shop", label: "Shop" }];
  if (config.about_page) links.push({ url: "/about", label: "About" })

  if (isAdmin) {
    links.push({ url: "/config", label: "Config" })
    links.push({ url: "/orders", label: "Orders" })
  }

  const renderLinks = (link, i) => (
    <Link to={link.url} key={`l${i}`}
      style={{flex: i === links.length - 1 ? 1 : null }}
      className={classes.menuButton}
    >
      <Typography variant="button" gutterBottom>{link.label}</Typography>
    </Link>
  )

  let menu;
  if (isWidthDown('sm', width)) {
    menu = <BannerHamburger links={links.map(renderLinks)} number={number} />
  } else {
    menu = (<span className={classes.buttons}>
        {links.map(renderLinks)}
        <Link to={`/cart`} className={classes.menuButton} style={{ marginRight: 0 }}>
          <Typography variant="button" gutterBottom>Cart{number}</Typography>
        </Link>
      </span>)
  }

  return (
    <div className={classes.root}>
      <AppBar position="static" color="secondary" className={classes.appbar}>
        <Toolbar>
          <Link to={`/`} className={classes.menuButton}>
            <div className="logo" />
            <h3 className={classes.storeName}>{config.store_name}</h3>
          </Link>
          { menu }
        </Toolbar>
      </AppBar>
    </div>
  );
};
export default withWidth()(withStyles(styles)(Banner));