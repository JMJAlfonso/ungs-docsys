import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./assets/styles/index.css";
import App from "./App.jsx";
import { ToastProvider } from "./context/ToastContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ToastProvider>
      <App />
    </ToastProvider>
  </StrictMode>
);
