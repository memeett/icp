import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { Button } from "./ui/Button";
function Footer() {
    return (_jsx("footer", { className: "border-t", children: _jsxs("div", { className: "container mx-auto px-4 md:px-6 py-8 flex flex-col md:flex-row justify-between items-center", children: [_jsxs("p", { className: "text-sm text-muted-foreground", children: ["\u00A9 ", new Date().getFullYear(), " Ergasia. All rights reserved."] }), _jsxs("div", { className: "flex gap-4 mt-4 md:mt-0", children: [_jsx(Button, { variant: "link", className: "text-muted-foreground", children: "Terms of Service" }), _jsx(Button, { variant: "link", className: "text-muted-foreground", children: "Privacy Policy" })] })] }) }));
}
export default Footer;
