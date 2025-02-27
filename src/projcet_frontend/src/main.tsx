import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter } from "react-router-dom";
import { RouterProvider } from "react-router-dom";
import LoginPage from "./Pages/LoginPage/LoginPage.tsx";
import "./styles/style.css";
import FindJobPage from "./Pages/FindJobPage/FindJobPage.tsx";
import ProfilePage from "./Pages/LoginPage/ProfilePage.tsx";
import PostJobPage from "./Pages/PostJobPage/PostJobPage.tsx";
import { ModalProvider } from "./contexts/modal-context.tsx";
import SearchPage from "./Pages/SearchPage/SearchPage.tsx";


const route = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />,
  },
  {
    path: "/profile",
    element: <ProfilePage />,
  },
  {
    path: "/FindJobPage",
    element: <FindJobPage />,
  },
  {
    path: "/PostJobPage",
    element: <PostJobPage />,
  },
]);

const rootElement = document.getElementById("root");
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <ModalProvider>
      <RouterProvider router={route}></RouterProvider>
    </ModalProvider>
  );
} else {
  console.error("Root element not found");
}
