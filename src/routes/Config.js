import React from "react";
import { Route } from "react-router-dom";

import ConfigPage from '../components/config/ConfigPage';
import CreateEditProduct from '../components/config/store-products/CreateEditProduct';
import CreateEditCollection from '../components/config/store-collections/CreateEditCollection';
import FeaturedProducts from '../components/config/store-collections/FeaturedProducts';

const Config = ({ match, config }) => (
  <div>
    <Route exact path={`${match.url}`} component={ConfigPage} />
    <Route exact path={`${match.url}/product/new`} component={CreateEditProduct} />
    { config.products.map((product,i) =>
        <Route exact key={`product${i}`}
          path={`${match.url}/product/${product.url}`} 
          render={(props) => 
            <CreateEditProduct product={product} />
          }
        />
      )
    }

    <Route exact path={`${match.url}/collection/new`} component={CreateEditCollection} />
    <Route exact path={`${match.url}/collection/featured-products`}
        render={(props) => {
          const featured = config.collections.find(c => c.url === "featured-products");
          return <FeaturedProducts collection={featured} />
        }}
    />
    { [...config.collections].filter(c => c.url !== "featured-products")
      .map((collection,i) =>
        <Route exact key={`collection${i}`}
          path={`${match.url}/collection/${collection.url}`} 
          render={(props) => 
            <CreateEditCollection collection={collection} />
          }
        />
      )
    }
  </div>
);

export default Config;