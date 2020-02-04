import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';

import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';

const styles = theme => ({
  hamburger: {
    flex: 1,
    textAlign: "right"
  },
  hamburgerButton: {
    textDecoration: "none",
    width: "100%",
    color: "black"
  },
});

function BannerHamburger({ classes, links, number }) {
  const [menu, toggleMenu] = useState(false);

  return (
    <span className={classes.hamburger}>
      <IconButton
        color="inherit" aria-label="Menu"
        onClick={() => toggleMenu(true)}
      >
        <MenuIcon />
      </IconButton>
      <SwipeableDrawer anchor="right"
        open={menu}
        onClose={() => toggleMenu(false)}
        onOpen={() => toggleMenu(true)}
      >
        <List style={{ width: "200px" }}>
          <ListItem>
            <Link
              to={`/`}
              className={classes.hamburgerButton}
              onClick={() => toggleMenu(false)}
            >
              <Typography variant="button" gutterBottom>Home</Typography>
            </Link>
          </ListItem>
          { links.map((l,i) => (
            <ListItem key={`link${i}`}>
              <span
                onClick={() => toggleMenu(false)} 
                style={{ display: "flex", width: "100%" }}
              >
                {l}
              </span>
            </ListItem>
          ))}
          <ListItem>
            <Link
              to={`/cart`}
              className={classes.hamburgerButton}
              onClick={() => toggleMenu(false)}
            >
              <Typography variant="button" gutterBottom>
                Cart{number}
              </Typography>
            </Link>
          </ListItem>
        </List>
      </SwipeableDrawer>
    </span>
  );
};
export default withStyles(styles)(BannerHamburger);