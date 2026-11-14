import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import "@fontsource-variable/vazirmatn";

import Routers from "./component/Routers";
import { ThemeProvider } from "./component/ThemeContext";
import { ToastProvider } from "./component/ToastContext";
import { DataProvider } from "./component/Context";

import "./assets/style/style.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider>
      <ToastProvider>
        <DataProvider>
          <RouterProvider router={Routers} />
        </DataProvider>
      </ToastProvider>
    </ThemeProvider>
  </StrictMode>,
);
