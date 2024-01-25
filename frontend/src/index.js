import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { AuthContextProvider } from "./context/AuthContext";
import ReactModal from "react-modal";
//redux imports
import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./redux/reducers/rootReducer"; // Update the import path to access the rootReducer.js file
import { Provider } from "react-redux"; // Redux Provider
import thunk from "redux-thunk";
import "@fortawesome/fontawesome-free/css/all.css";

// Create the Redux store using configureStore
const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk), // Add your middleware (e.g., Redux Thunk) here
});
ReactModal.setAppElement("#root");

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <AuthContextProvider>
    <BrowserRouter>
      <Provider store={store}>
        <App />
      </Provider>
    </BrowserRouter>
  </AuthContextProvider>
);
