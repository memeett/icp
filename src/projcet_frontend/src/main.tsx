import ReactDOM from 'react-dom/client';
import { createBrowserRouter } from 'react-router-dom';
import { RouterProvider } from 'react-router-dom';
import './styles/style.css';
import FindJobPage from './Pages/FindJobPage/FindJobPage.tsx';
import ProfilePage from './Pages/LoginPage/ProfilePage.tsx';
import PostJobPage from './Pages/PostJobPage/PostJobPage.tsx';
import { ModalProvider } from './contexts/modal-context.tsx';
import JobDetailPage from './Pages/JobDetailPage/JobDetailPage.tsx';
import ManageJobPage from './Pages/ManageJobPage/ManageJobPage.tsx';
import RegisterFace from './Pages/LoginPage/RegisterFacePage.tsx';
import LoginFace from './Pages/LoginPage/LoginFace.tsx';
import BrowseFreelancerPage from './Pages/BrowseFreelancerPage/BrowseFreelancerPage.tsx';
import PublicProfile from './Pages/profile/PublicProfile.tsx';
import { BooleanProvider } from './components/context/Context.tsx';
import LandingPage from './Pages/general/LandingPage.tsx';

const route = createBrowserRouter([
    {
        path: '/',
        element: <LandingPage />,
    },
    {
        path: '/profile',
        element: <ProfilePage />,
    },
    {
        path: '/profile/:id',
        element: <PublicProfile />,
    },
    {
        path: '/find',
        element: <FindJobPage />,
    },
    {
        path: '/post',
        element: <PostJobPage />,
    },
    {
        path: '/jobs/:jobId',
        element: <JobDetailPage />,
    },
    {
        path: '/manage',
        element: <ManageJobPage />,
    },

    {
        path: '/browse',
        element: <BrowseFreelancerPage />,
    },
    {
        path: '/face-recognition/register',
        element: <RegisterFace />,
    },
    {
        path: '/face-recognition/login',
        element: <LoginFace />,
    },
]);

const rootElement = document.getElementById('root');
if (rootElement) {
    ReactDOM.createRoot(rootElement).render(
        <BooleanProvider>
            <ModalProvider>
                <RouterProvider router={route}></RouterProvider>
            </ModalProvider>
        </BooleanProvider>
    );
} else {
    console.error('Root element not found');
}
