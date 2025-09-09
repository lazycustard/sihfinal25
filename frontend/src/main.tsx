import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import './index.css'; // This is correct if index.css is in frontend/
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
