import { AuthClient } from "@dfinity/auth-client";
import { useState } from "react";
import { user } from "../../../declarations/user";
import { loginBtnClick } from "../controller/userController";

export default function UserTesting() {
    const [principle, setPrinciple] = useState('')

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