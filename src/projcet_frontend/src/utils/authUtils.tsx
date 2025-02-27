import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCookie, validateCookie, loginWithInternetIdentity, logout,fetchUserBySession } from "../controller/userController";


export const authUtils = () => {
    const navigate = useNavigate();
    const cookie = getCookie("cookie");
    const session = localStorage.getItem("session");
    useEffect(() => {
        if (!cookie && !session) {
            logout();
        }
        fetchUserBySession().then((user) => {
            if (!user) {
                logout();
            }
            
        });
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
            logout();
        }
    }, []);

}