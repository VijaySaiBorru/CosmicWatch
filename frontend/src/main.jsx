import { StrictMode } from 'react'
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import './index.css'
import App from './App.jsx'
import { RouterProvider } from "react-router-dom";
import router from "./router/router";
import { SocketProvider } from './context/SocketContext';

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <SocketProvider>
        <RouterProvider router={router} />
      </SocketProvider>
    </Provider>
  </React.StrictMode>
);
