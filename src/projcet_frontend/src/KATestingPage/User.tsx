import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginBtnClick, logout, getCookie, validateCookie } from "../controller/userController";

export default function UserTesting() {
    const navigate = useNavigate();
    const cookie = getCookie("cookie");
    const session = localStorage.getItem("session");

    useEffect(() => {
        console.log("Cookie:", cookie);
        console.log("Session:", session);
        if (!cookie && !session) {
            logout();
        }
        if (cookie == session && cookie && session) {
            navigate('/');
        }
        else if (cookie && !session) {
            console.log("Validating cookie");
            validateCookie().then((val) => {
                if (val) {
                    navigate('/');
                }
            });
        }
        else if (cookie && (cookie !== session)) {
            console.log("logging out");
            logout();
        }
    }, []);


    return (
        <>
            <div>
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        loginBtnClick().then((suc) => {
                            if (suc) {
                                navigate('/');
                            }
                        });
                    }}
                    className="bg-[#64B6F7] hover:bg-opacity-90 px-4 py-2 rounded-md text-sm font-medium"
                >
                    Join Now
                </button>
            </div>
        </>

    );
}