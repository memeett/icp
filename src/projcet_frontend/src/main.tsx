import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter } from "react-router-dom";
import { RouterProvider } from "react-router-dom";
import LoginPage from "./Pages/LoginPage/LoginPage.tsx";
import "./styles/style.css";
import FindJobPage from "./Pages/FindJobPage/FindJobPage.tsx";
import ProfilePage from "./Pages/LoginPage/ProfilePage.tsx";
import PostJobPage from "./Pages/PostJobPage/PostJobPage.tsx";
import SearchPage from "./Pages/SearchPage/SearchPage.tsx";

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
    path: "/PostJobPage",
    element: <PostJobPage/>,
  },
  {
    path: "/testing/ka",
    element: <UserTesting />,
  },
  {
    path: "/testing/pp",
    element: <CreateJobForm />,
  },
  {
    path: "/testing/lo",
    element: <SearchPage />,

  }
]);

const rootElement = document.getElementById("root");
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(

      <RouterProvider router={route}></RouterProvider>
  );
} else {
  console.error("Root element not found");
}
