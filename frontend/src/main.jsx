import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { ToastContainer } from "react-toastify";
import { Provider } from "react-redux";
import store from "./redux/store.js";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <PayPalScriptProvider>
      <Provider store={store}>
        <App />
        <ToastContainer position="top-right" />
      </Provider>
    </PayPalScriptProvider>
  </StrictMode>
);
