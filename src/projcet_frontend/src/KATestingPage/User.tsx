import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { loginBtnClick, validateSession } from "../controller/userController";

export default function UserTesting() {
    const navigate = useNavigate(); // Initialize navigate

    useEffect(() => {
        validateSession().then((val) =>{
            console.log(val)
            if(val){
                navigate('/')
            }
        })
    }, []);

    return (
        <>
            <div>
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        loginBtnClick();
                    }}
                    className="bg-[#64B6F7] hover:bg-opacity-90 px-4 py-2 rounded-md text-sm font-medium"
                >
                    Join Now
                </button>
            </div>
        </>
    );
}
