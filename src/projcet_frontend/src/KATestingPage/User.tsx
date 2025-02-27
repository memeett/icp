import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { logout, getCookie, validateCookie, loginWithInternetIdentity } from "../controller/userController";
import { authUtils } from "../utils/authUtils";

export default function UserTesting() {
    const navigate = useNavigate();
    const cookie = getCookie("cookie");
    const session = localStorage.getItem("session");

    useEffect(() => {
        console.log("Cookie:", cookie);
        console.log("Session:", session);
    }, []);

    authUtils();

    // const getPrincipalIdBtnClick = async () => {
    //     try {
    //         const principalId = await getPrincipalId();
    //         console.log("Principal ID:", principalId);
    //         getUser(principalId).then((user) => {
    //             console.log("User:", user);
    //         });
    //     } catch (error) {
    //         console.error("Failed to get principal ID:", error);
    //     }
    // };


    return (
        <>
            <div>
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        loginWithInternetIdentity().then((suc) => {
                            if (suc) {
                                navigate('/');
                            }
                        });
                    }}
                    className="bg-[#64B6F7] hover:bg-opacity-90 px-4 py-2 rounded-md text-sm font-medium"
                >
                    Join Now
                </button>
                <button
                    className="bg-[#64B6F7] hover:bg-opacity-90 px-4 py-2 rounded-md text-sm font-medium">
                    getPrincipalId
                </button>
            </div>
        </>

    );
}