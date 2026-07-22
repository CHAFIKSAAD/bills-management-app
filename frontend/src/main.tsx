import React from "react";
import ReactDOM from "react-dom/client";
import { Toaster } from "react-hot-toast";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3000,
        style: {
          borderRadius: "12px",
          background: "#111827",
          color: "#fff",
          fontWeight: "600",
        },
        success: {
          iconTheme: {
            primary: "#e52521",
            secondary: "#fff",
          },
        },
        error: {
          iconTheme: {
            primary: "#e52521",
            secondary: "#fff",
          },
        },
      }}
    />
  </React.StrictMode>
);