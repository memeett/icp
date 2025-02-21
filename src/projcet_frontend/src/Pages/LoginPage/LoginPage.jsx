import { HttpAgent } from '@dfinity/agent';
import { AuthClient } from '@dfinity/auth-client';
import { useEffect, useState } from 'react';
import { user } from '../../../../declarations/user';
import { session } from '../../../../declarations/session';

export default function LoginPage() {
    const [principal, setPrinciple] = useState('')

    const getCookie = (name) => {
        const cookies = document.cookie.split('; ');
        for (let cookie of cookies) {
            const [key, value] = cookie.split('=');
            if (key === name) {
                return decodeURIComponent(value);
            }
        }
        return null;
    };

    useEffect(() => {
        const sessionId = getCookie('sessionId');
        if (sessionId) {
            session.validateSession(sessionId).then((res) => {
                console.log("Session validation result:", res);
            }).catch((err) => {
                console.error("Session validation failed:", err);
            });
        }
    }, []);

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
        user.login(principalId).then((res) => {
            if (!res) {
                console.log("Login Failed");
            } else {
                console.log(res);

                // Store the response in a cookie
                document.cookie = `sessionId=${encodeURIComponent(JSON.stringify(res))}; path=/; Secure`;
            }
        }).catch((err) => {
            console.error("Login request failed:", err);
        });

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
