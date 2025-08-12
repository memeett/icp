import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { AppProviders } from './app/providers/AppProviders';
import { AppRouter } from './app/router';
import { NotificationContainer } from './ui/components/NotificationContainer';
import './styles/style.css';
function App() {
    return (_jsx(AppProviders, { children: _jsxs("div", { className: "App", children: [_jsx(AppRouter, {}), _jsx(NotificationContainer, {})] }) }));
}
export default App;
