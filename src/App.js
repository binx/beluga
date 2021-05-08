import React, { useState, useEffect } from 'react';
import { StripeProvider } from 'react-stripe-elements';
import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { getProductsFromCollection } from "./util";

import Landing from './components/Landing';
import AboutPage from './components/AboutPage';
import ScrollToTop from './components/ui/ScrollToTop';
import Banner from './components/ui/Banner';
import Collection from './components/product/Collection';
import CollectionList from './components/product/CollectionList';
import Product from './components/product/Product';

import Cart from './components/cart/Cart';
import Checkout from './components/checkout/Checkout';
import Confirm from './components/checkout/Confirm';

import Config from "./routes/Config";

import InitialConfig from "./components/config/InitialConfig";
import Orders from './components/admin/Orders';
import Login from './components/admin/Login';

import NotFound404 from "./components/NotFound404"

import { useSelector, useDispatch } from "react-redux";

function App(props) {
  const [quantity, setQuantity] = useState();

  const config = useSelector(state => state.reducers.config);
  const isAdmin = useSelector(state => state.reducers.isAdmin);
  const dispatch = useDispatch();

  useEffect(() => {
    document.title = config.store_name;

    const slug = `${config.store_slug}_products`;
    const items = JSON.parse(localStorage.getItem(slug));
    setQuantity(items ? items.length : 0);

    fetch('/user/')
      .then(res => res.json())
      .then(result => {
        dispatch({ type: "SET_ADMIN", isAdmin: result.isAdmin })
      })
  }, []);

  if (!config || typeof isAdmin === "undefined") return (null);
  if (!config.api_key)
    return (
      <Router>
        <InitialConfig />
      </Router>
    );

  const theme = createMuiTheme({
    palette: {
      primary: {
        main: config.colors.primary.main,
        dark: config.colors.primary.dark,
        contrastText: config.colors.primary.contrastText
      },
      secondary: {
        main: config.colors.secondary.main,
        contrastText: config.colors.secondary.contrastText
      },
    },
    typography: {
      fontFamily: [
        'Raleway',
        'Roboto',
        'Helvetica',
        'sans-serif'
      ]
    },
  });

  return (
      <StripeProvider apiKey={config.api_key}>
      <Router>
        <ScrollToTop>
          <MuiThemeProvider theme={theme}>
            <Banner quantity={quantity} config={config} />
            <Switch>
              <Route exact path="/"
                render={(props) => <Landing config={config} />}
              />
              { config.about_page && (
                <Route exact path="/about" component={AboutPage} />
              )}
              <Route exact path="/shop"
                render={(props) => <CollectionList config={config} />}
              />
              <Route exact path="/collection/all-products"
                render={(props) => <Collection products={config.products} title={"All Products"} />}
              />
              { config.collections.map((collection,i) =>
                  <Route exact key={`route${i}`}
                    path={`/collection/${collection.url}`} 
                    render={(props) => {
                      const products = getProductsFromCollection(config, collection.url)
                      return (
                        <Collection
                          products={products}
                          title={collection.name}
                        />
                      )
                    }}
                  />
                )
              }
              { config.products.map((product,i) =>
                  <Route exact key={`route${i}`}
                    path={`/product/${product.url}`} 
                    render={(props) => 
                      <Product
                        product={product}
                        config={config} 
                        updateNumber={setQuantity}
                      />
                    }
                  />
                )
              }
              <Route exact path="/cart"
                render={(props) => <Cart config={config} updateNumber={setQuantity} />}
              />
              <Route exact path="/checkout"
                render={(props) => <Checkout config={config} updateNumber={setQuantity} />}
              />
              <Route exact path="/confirm" component={Confirm} />
              <Route exact path="/login" component={Login} />
              
              {isAdmin && (
                <Route path="/config/" render={(props) => 
                  <Config config={config} match={props.match} />
                } />
              )}
              {isAdmin && (
                <Route exact path="/orders" component={Orders} />
              )}
            
              <Route component={NotFound404} />
            </Switch>
          </MuiThemeProvider>
        </ScrollToTop>
      </Router>
    < /StripeProvider>
  );
};
export default App;