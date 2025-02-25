import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { loginBtnClick, validateSession } from "../controller/userController";

export default function UserTesting() {
    const [principle, setPrinciple] = useState("");
    const navigate = useNavigate(); // Initialize navigate

    useEffect(() => {
        validateSession().then((val) =>{
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
                        loginBtnClick(setPrinciple);
                    }}
                    className="bg-[#64B6F7] hover:bg-opacity-90 px-4 py-2 rounded-md text-sm font-medium"
                >
                    Join Now
                </button>
            </div>
        </>
    );
}
