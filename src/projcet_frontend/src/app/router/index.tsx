import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Spin } from 'antd';
import { ErrorBoundary } from 'react-error-boundary';
import { ErrorFallback } from '../../shared/components/ErrorFallback';

// Lazy load pages for better performance
const LandingPage = lazy(() => import('../../pages/LandingPage'));
const FindJobPage = lazy(() => import('../../pages/FindJobPage'));
const PostJobPage = lazy(() => import('../../pages/PostJobPage'));
const JobDetailPage = lazy(() => import('../../pages/JobDetailPage'));
const ProfilePage = lazy(() => import('../../pages/ProfilePage'));
const PublicProfilePage = lazy(() => import('../../pages/PublicProfilePage'));
const ManageJobPage = lazy(() => import('../../pages/ManageJobPage'));
const BrowseFreelancerPage = lazy(() => import('../../pages/BrowseFreelancerPage'));
const RegisterFacePage = lazy(() => import('../../pages/RegisterFacePage'));
const LoginFacePage = lazy(() => import('../../pages/LoginFacePage'));

// Loading component for suspense fallback
const PageLoader: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center">
    <Spin size="large" tip="Loading..." />
  </div>
);

// Route wrapper with error boundary
const RouteWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ErrorBoundary FallbackComponent={ErrorFallback}>
    <Suspense fallback={<PageLoader />}>
      {children}
    </Suspense>
  </ErrorBoundary>
);

export const AppRouter: React.FC = () => {
  return (
    <Routes>
      <Route 
        path="/" 
        element={
          <RouteWrapper>
            <LandingPage />
          </RouteWrapper>
        } 
      />
      <Route 
        path="/find" 
        element={
          <RouteWrapper>
            <FindJobPage />
          </RouteWrapper>
        } 
      />
      <Route 
        path="/post" 
        element={
          <RouteWrapper>
            <PostJobPage />
          </RouteWrapper>
        } 
      />
      <Route 
        path="/jobs/:jobId" 
        element={
          <RouteWrapper>
            <JobDetailPage />
          </RouteWrapper>
        } 
      />
      <Route 
        path="/profile" 
        element={
          <RouteWrapper>
            <ProfilePage />
          </RouteWrapper>
        } 
      />
      <Route 
        path="/profile/:id" 
        element={
          <RouteWrapper>
            <PublicProfilePage />
          </RouteWrapper>
        } 
      />
      <Route 
        path="/manage" 
        element={
          <RouteWrapper>
            <ManageJobPage />
          </RouteWrapper>
        } 
      />
      <Route 
        path="/browse" 
        element={
          <RouteWrapper>
            <BrowseFreelancerPage />
          </RouteWrapper>
        } 
      />
      <Route 
        path="/face-recognition/register" 
        element={
          <RouteWrapper>
            <RegisterFacePage />
          </RouteWrapper>
        } 
      />
      <Route 
        path="/face-recognition/login" 
        element={
          <RouteWrapper>
            <LoginFacePage />
          </RouteWrapper>
        } 
      />
      {/* 404 Route */}
      <Route 
        path="*" 
        element={
          <RouteWrapper>
            <div className="min-h-screen flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
                <p className="text-gray-600 mb-8">Page not found</p>
                <a href="/" className="text-purple-600 hover:text-purple-800">
                  Go back home
                </a>
              </div>
            </div>
          </RouteWrapper>
        } 
      />
    </Routes>
  );
};