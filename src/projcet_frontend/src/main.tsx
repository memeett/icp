import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter } from "react-router-dom";
import { RouterProvider } from "react-router-dom";
import LoginPage from "./Pages/LoginPage/LoginPage.tsx";
import "./styles/style.css";
import FindJobPage from "./Pages/FindJobPage/FindJobPage.tsx";
import UserTesting from "./KATestingPage/User.tsx";
import CreateJobForm from "./KATestingPage/JobPage.tsx";


const route = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />,
  },
  {
    path: "/FindJobPage",
    element: <FindJobPage/>,
  },
  {
    path: "/testing/ka",
    element: <UserTesting />,
  },
  {
    path: "/testing/pp",
    element: <CreateJobForm />,
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
