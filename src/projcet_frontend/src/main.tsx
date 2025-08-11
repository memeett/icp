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
import JobDetailPage from "./Pages/JobDetailPage/JobDetailPage.tsx";
import FaceTes from "./Pages/LoginPage/FaceTes.tsx";
import ManageJobPage from "./Pages/ManageJobPage/ManageJobPage.tsx";
import RegisterFace from "./Pages/LoginPage/RegisterFacePage.tsx";
import LoginFace from "./Pages/LoginPage/LoginFace.tsx";
import BrowseFreelancerPage from "./Pages/BrowseFreelancerPage/BrowseFreelancerPage.tsx";
import PublicProfile from "./Pages/profile/PublicProfile.tsx";
import ManageJobDetailPage from "./Pages/JobDetailPage/SubmissionSection.tsx";
import { BooleanProvider } from "./components/context/Context.tsx";
import { AgentProvider } from "./singleton/AgentProvider.tsx";

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

]);

const rootElement = document.getElementById("root");
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <BooleanProvider>
      
    <ModalProvider>
      <AgentProvider>
        <RouterProvider router={route}></RouterProvider>
      </AgentProvider>
    </ModalProvider>
    </BooleanProvider>
  );
} else {
  console.error("Root element not found");
}
