import { useNavigate } from "react-router-dom";
import { Button } from "./ui/Button";
import { useAuth } from "../hooks/useAuth";
import ergasiaLogo from '../assets/ergasia_logo.png';
import { LogIn } from "lucide-react";
import React from "react";

const Navbar: React.FC = () => {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
                <div
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={() => navigate('/')}
                >
                    <img
                        src={ergasiaLogo}
                        alt="Ergasia Logo"
                        className="h-8 w-auto"
                    />
                </div>
                <nav className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        onClick={() => navigate('/find-work')}
                    >
                        Find Work
                    </Button>
                    <Button
                        variant="ghost"
                        onClick={() => navigate('/post-job')}
                    >
                        Post a Job
                    </Button>
                    {isAuthenticated ? (
                        <Button onClick={() => navigate('/dashboard')}>
                            Dashboard
                        </Button>
                    ) : (
                        <Button onClick={() => navigate('/login')}>
                            <LogIn className="mr-2 h-4 w-4" /> Sign In
                        </Button>
                    )}
                </nav>
            </div>
        </header>
    );
}

export default Navbar;