import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { Button, Result } from 'antd';
import { RefreshCw, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
export const ErrorFallback = ({ error, resetErrorBoundary }) => {
    const navigate = useNavigate();
    const handleGoHome = () => {
        navigate('/');
        resetErrorBoundary();
    };
    return (_jsx("div", { className: "min-h-screen flex items-center justify-center bg-gray-50", children: _jsx(Result, { status: "500", title: "Oops! Something went wrong", subTitle: _jsxs("div", { className: "space-y-2", children: [_jsx("p", { className: "text-gray-600", children: "We encountered an unexpected error. Don't worry, our team has been notified." }), process.env.NODE_ENV === 'development' && (_jsxs("details", { className: "mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-left", children: [_jsx("summary", { className: "cursor-pointer font-medium text-red-800", children: "Error Details (Development Only)" }), _jsxs("pre", { className: "mt-2 text-sm text-red-700 whitespace-pre-wrap", children: [error.message, error.stack && (_jsxs(_Fragment, { children: ['\n\nStack Trace:\n', error.stack] }))] })] }))] }), extra: _jsxs("div", { className: "flex gap-3 justify-center", children: [_jsx(Button, { type: "primary", icon: _jsx(RefreshCw, { size: 16 }), onClick: resetErrorBoundary, children: "Try Again" }), _jsx(Button, { icon: _jsx(Home, { size: 16 }), onClick: handleGoHome, children: "Go Home" })] }) }) }));
};
