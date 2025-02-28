import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { getCookie, validateCookie, logout, fetchUserBySession } from "../controller/userController";

export const authUtils = () => {
    const navigate = useNavigate();
    const cookie = getCookie("cookie");
    const session = localStorage.getItem("session");

    useEffect(() => {
        const checkAuth = async () => {
            if (!cookie && !session) {
                navigate('/');
                await logout();
                return;
            }

            const user = await fetchUserBySession();
            if (!user) {
                navigate('/');
                await logout();
                return;
            }
            if (cookie && !session) {
                console.log("Validating cookie");
                const isValid = await validateCookie();
                if (!isValid) {
                    navigate('/');
                    await logout();
                    return;
                }
            } else if (cookie && cookie !== session) {
                await logout();
            }
        };

        checkAuth();
    }, [cookie, session, navigate]);

    return useMemo(() => ({ cookie, session }), [cookie, session]);
};