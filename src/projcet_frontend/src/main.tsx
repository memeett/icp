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
import CompleteProfilePage from './Pages/CompleteProfilePage/CompleteProfilePage.tsx';
import SimpleLoginPage from './Pages/LoginPage/SimpleLoginPage.tsx';
import ProfileCompletionGuard from './components/guards/ProfileCompletionGuard.tsx';
import AuthInitializer from './hooks/useAuthInitializer.tsx';

const route = createBrowserRouter([
    {
        path: '/',
        element: <LandingPage />,
    },
    {
        path: '/login',
        element: <SimpleLoginPage />,
    },
    {
        path: '/complete-profile',
        element: <CompleteProfilePage />,
    },
    {
        path: '/profile',
        element: (
            <ProfileCompletionGuard>
                <ProfilePage />
            </ProfileCompletionGuard>
        ),
    },
    {
        path: '/profile/:id',
        element: <PublicProfile />,
    },
    {
        path: '/find',
        element: (
            <ProfileCompletionGuard>
                <FindJobPage />
            </ProfileCompletionGuard>
        ),
    },
    {
        path: '/post',
        element: (
            <ProfileCompletionGuard>
                <PostJobPage />
            </ProfileCompletionGuard>
        ),
    },
    {
        path: '/jobs/:jobId',
        element: (
            <ProfileCompletionGuard>
                <JobDetailPage />
            </ProfileCompletionGuard>
        ),
    },
    {
        path: '/manage',
        element: (
            <ProfileCompletionGuard>
                <ManageJobPage />
            </ProfileCompletionGuard>
        ),
    },
    {
        path: '/browse',
        element: (
            <ProfileCompletionGuard>
                <BrowseFreelancerPage />
            </ProfileCompletionGuard>
        ),
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
                <AuthInitializer />
                <RouterProvider router={route}></RouterProvider>
            </ModalProvider>
        </BooleanProvider>
    );
} else {
    console.error('Root element not found');
}
