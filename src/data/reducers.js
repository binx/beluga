import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";

import store_config from "../assets/store_config";

const initialState = {
  config: store_config
}

const reducers = function calls(state = { ...initialState }, action) {
  let config = { ...state.config };
  switch (action.type) {
    case "SET_ADMIN":
      return { ...state, isAdmin: action.isAdmin };
    case "SET_CONFIG":
      return { ...state, config: action.config };
    case "SET_PRODUCTS":
      config.products = action.products;
      return { ...state, config };
    case "SET_COLLECTIONS":
      config.collections = action.collections;
      return { ...state, config };
    default:
      return state;
  }
};

export default history =>
  combineReducers({
    router: connectRouter(history),
    reducers
  });