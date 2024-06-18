import React from "react";
import ReactDOM from "react-dom/client";
import Providers from "./Providers";
import "./index.css";
import { AuthProvider } from "./Components/Auth/AuthProvider";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <AuthProvider>
      <Providers />
    </AuthProvider>
  </React.StrictMode>
);
