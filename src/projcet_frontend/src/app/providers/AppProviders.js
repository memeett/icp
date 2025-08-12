import { jsx as _jsx } from "react/jsx-runtime";
import { BrowserRouter } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import { ConfigProvider } from 'antd';
import { Provider as JotaiProvider } from 'jotai';
import { ThemeProvider } from './ThemeProvider';
import { ModalProvider } from '../../contexts/modal-context';
import { ErrorFallback } from '../../shared/components/ErrorFallback';
import { antdTheme } from '../theme/antd-theme';
export const AppProviders = ({ children }) => {
    return (_jsx(ErrorBoundary, { FallbackComponent: ErrorFallback, onError: (error, errorInfo) => {
            console.error('Application Error:', error, errorInfo);
        }, children: _jsx(BrowserRouter, { children: _jsx(JotaiProvider, { children: _jsx(ConfigProvider, { theme: antdTheme, children: _jsx(ThemeProvider, { children: _jsx(ModalProvider, { children: children }) }) }) }) }) }));
};
