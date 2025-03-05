import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter } from "react-router-dom";
import { RouterProvider } from "react-router-dom";
import LoginPage from "./Pages/LoginPage/LoginPage.tsx";
import "./styles/style.css";
import FindJobPage from "./Pages/FindJobPage/FindJobPage.tsx";
// import UserTesting from "./KATestingPage/User.tsx";
// import CreateJobForm from "./KATestingPage/JobPage.tsx";
import ProfilePage from "./Pages/LoginPage/ProfilePage.tsx";
import PostJobPage from "./Pages/PostJobPage/PostJobPage.tsx";
import { ModalProvider } from "./contexts/modal-context.tsx";
import SearchPage from "./Pages/SearchPage/SearchPage.tsx";
import JobDetailPage from "./Pages/JobDetailPage/JobDetailPage.tsx";
import FaceTes from "./Pages/LoginPage/FaceTes.tsx";
import ManageJobPage from "./Pages/ManageJobPage/ManageJobPage.tsx";
import RegisterFace from "./Pages/LoginPage/RegisterFacePage.tsx";
import LoginFace from "./Pages/LoginPage/LoginFace.tsx";
import ManageJobDetailPage from "./Pages/ManageJobDetailPage/ManageJobDetailPage.tsx";
import BrowseFreelancerPage from "./Pages/BrowseFreelancerPage/BrowseFreelancerPage.tsx";
import PublicProfile from "./Pages/profile/PublicProfile.tsx";


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
    path: "/profile/:id",
    element: <PublicProfile />,
  },
  {
    path: "/find",
    element: <FindJobPage />,
  },
  {
    path: "/post",
    element: <PostJobPage />,
  },
  {
    path: "/jobs/:jobId",
    element: <JobDetailPage />,
  },
  {
    path: "/manage",
    element: <ManageJobPage />,
  },
  {
    path: "/browse",
    element: <BrowseFreelancerPage />,
  },
  {
    path: "/face-recognition/register",
    element: <RegisterFace />,
  },
  {
    path: "/face-recognition/login",
    element: <LoginFace />,
  },
  {
    path: "/manage-jobs/:jobId",
    element: <ManageJobDetailPage />,
  }
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
