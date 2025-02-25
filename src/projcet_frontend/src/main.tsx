import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.scss";
import { createBrowserRouter } from "react-router-dom";
import { RouterProvider } from "react-router-dom";
import LandingPage from "./Pages/LoginPage/LoginPage.tsx";
import LoginPage from "./Pages/LoginPage/FaceTes.tsx";
import FaceTes from "./Pages/LoginPage/FaceTes.tsx";

const route = createBrowserRouter([
  {
    path: "/",
    element: <FaceTes />,
  },
]);

const rootElement = document.getElementById("root");
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <RouterProvider router={route}></RouterProvider>
    </React.StrictMode>
  );
} else {
  console.error("Root element not found");
}
