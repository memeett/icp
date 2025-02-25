import { AuthClient } from "@dfinity/auth-client";
import { useEffect, useState } from "react";
import { user } from "../../../declarations/user";
import { loginBtnClick, validateSession } from "../controller/userController";
import { useNavigate } from "react-router-dom";

export default function UserTesting() {
    const [principle, setPrinciple] = useState('')
    const navigate = useNavigate()
    useEffect(() =>{
        validateSession().then((res) =>{
            console.log(res)
            if(res){
                navigate('/')
            }
        })
    }, [])

    return (
        <>
            <div>
                <button onClick={(e) => {
                        e.preventDefault();
                        loginBtnClick(setPrinciple);
                    }} className="bg-[#64B6F7] hover:bg-opacity-90 px-4 py-2 rounded-md text-sm font-medium">
                    Join Now
                </button>
            </div>
        </>
    )
}