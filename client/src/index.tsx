import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import ContextMenuProvider from "./Components/ContextMenu/ContextMenuProvider";
import AuthProvider from "./Components/Auth/AuthProvider";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <AuthProvider>
      <ContextMenuProvider>
        <App />
      </ContextMenuProvider>
    </AuthProvider>
  </React.StrictMode>
);
