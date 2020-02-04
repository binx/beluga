import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

import { Provider } from "react-redux";
import { store, history } from "./data/store.js";
import { ConnectedRouter } from "connected-react-router";
// uncomment if you would like to serve the final site with service workers
// import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <App />
    </ConnectedRouter>
  </Provider>, document.getElementById('root'));
// registerServiceWorker();