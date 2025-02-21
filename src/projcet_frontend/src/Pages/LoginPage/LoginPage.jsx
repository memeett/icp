import { HttpAgent } from '@dfinity/agent';
import { AuthClient } from '@dfinity/auth-client';
import { auth } from '../../../../declarations/auth/'
import { useEffect, useState } from 'react';

export default function LoginPage() {
    const [principal, setPrinciple] = useState('')

    useEffect(() =>{
        auth.getToken().then((result) =>{
            setPrinciple(result)
        })
        
    }, [])

    const loginButton = async (e) => {
        e.preventDefault();

        let authClient = await AuthClient.create();

        await new Promise((resolve) => {
            authClient.login({
                identityProvider: process.env.II_URL,
                onSuccess: resolve,
            });
        });

        const identity = authClient.getIdentity()
        const principalId = identity.getPrincipal().toString();
        setPrinciple(principalId)
        

        try {
            await auth.setToken(principalId);
            console.log("Token set successfully");
        } catch (error) {
            console.error("Error setting token:", error);
        }

    };

    return (
        <>
            <button onClick={loginButton}>Login With Internet Identity</button>
            {principal && (
                <div>
                    <p>Logged in user: {principal}</p>
                </div>
            )}
        </>
    );
}
