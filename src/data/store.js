import { createStore, compose, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { routerMiddleware } from "connected-react-router";
import { createBrowserHistory } from "history";
import createRootReducer from "./reducers";

const history = createBrowserHistory();
const store = createStore(
  createRootReducer(history),
  compose(
    applyMiddleware(routerMiddleware(history), thunk)
  )
);

export { store, history };