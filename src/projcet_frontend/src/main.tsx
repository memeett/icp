import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter } from "react-router-dom";
import { RouterProvider } from "react-router-dom";
import LoginPage from "./Pages/LoginPage/LoginPage.tsx";
import "./styles/style.css";
import FindJobPage from "./Pages/FindJobPage/FindJobPage.tsx";
import UserTesting from "./KATestingPage/User.tsx";
import ProfilePage from "./Pages/LoginPage/ProfilePage.tsx";


const route = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />,
  },
  {
    path: "/profile",
    element: <ProfilePage />
  },
  {
    path: "/FindJobPage",
    element: <FindJobPage />,
  },
  {
    path: "/testing/ka",
    element: <UserTesting />,
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
