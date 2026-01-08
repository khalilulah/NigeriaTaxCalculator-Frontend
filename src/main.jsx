import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App.jsx";
import TaxCalculator from "./CalculateTax.jsx";
import NavBar from "./NavBar.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/calculator" element={<TaxCalculator />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
