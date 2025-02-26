import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginBtnClick, logout, getCookie, validateCookie,getUser,getPrincipalId } from "../controller/userController";

export default function UserTesting() {
    const navigate = useNavigate();
    const cookie = getCookie("cookie");
    const session = localStorage.getItem("session");

    useEffect(() => {
        console.log("Cookie:", cookie);
        console.log("Session:", session);

        // if (!cookie && !session) {
        //     logout();
        // }
        // if (cookie == session && cookie && session) {
        //     navigate('/');
        // }
        // else if (cookie && !session) {
        //     console.log("Validating cookie");
        //     validateCookie().then((val) => {
        //         if (val) {
        //             navigate('/');
        //         }
        //     });
        // }
        // else if (cookie && (cookie !== session)) {
        //     console.log("logging out");
        //     logout();
        // }
    }, []);

    const getPrincipalIdBtnClick = async () => {
        try {
            const principalId = await getPrincipalId();
            console.log("Principal ID:", principalId);
            getUser(principalId).then((user) => {
                console.log("User:", user);
            });
        } catch (error) {
            console.error("Failed to get principal ID:", error);
        }
    };


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
                <button onClick={(e) => {
                    e.preventDefault();
                    getPrincipalIdBtnClick().then(() => {
                        navigate('/');
                    });
                }} className="bg-[#64B6F7] hover:bg-opacity-90 px-4 py-2 rounded-md text-sm font-medium">
                    getPrincipalId
                </button>
            </div>
        </>

    );
}