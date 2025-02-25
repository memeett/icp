import { HttpAgent } from "@dfinity/agent";
import { AuthClient } from "@dfinity/auth-client";
import { useEffect, useState } from "react";
import { user } from "../../../../declarations/user/index.js";
import { session } from "../../../../declarations/session";
import Navbar from "../../components/Navbar";
import { WavyBackground } from "../../components/ui/wavy-background.js";
import { AuroraText } from "../../components/ui/aurora-text.js";

export default function s (){
  const [principal, setPrinciple] = useState("");

  const getCookie = (name: string) => {
    const cookies = document.cookie.split("; ");
    for (let cookie of cookies) {
      const [key, value] = cookie.split("=");
      if (key === name) {
        return decodeURIComponent(value);
      }
    }
    return null;
  };

  useEffect(() => {
    const sessionId = getCookie("sessionId");
    if (sessionId) {
      session
        .validateSession(sessionId)
        .then((res) => {
          console.log("Session validation result:", res);
        })
        .catch((err) => {
          console.error("Session validation failed:", err);
        });
    }
  }, []);

  const loginButton = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    let authClient = await AuthClient.create();

    await new Promise((resolve) => {
      authClient.login({
        identityProvider: process.env.II_URL,
        onSuccess: resolve,
      });
    });

    const identity = authClient.getIdentity();
    const principalId = identity.getPrincipal().toString();
    setPrinciple(principalId);
    user
      .login(principalId)
      .then((res) => {
        if (!res) {
          console.log("Login Failed");
        } else {
          console.log(res);
          document.cookie = `sessionId=${encodeURIComponent(
            JSON.stringify(res)
          )}; path=/; Secure`;
        }
      })
      .catch((err) => {
        console.error("Login request failed:", err);
      });
  };

  return (
    <div className="flex flex-col h-screen ">
      {/* Navbar - Stays on top, does not scroll */}
      <div className="flex-none w-full bg-white shadow-md z-50">
        <Navbar />
      </div>

      {/* Main Content - This is the only scrollable section */}
      <div className="flex-grow overflow-x-hidden scrollbar-hide">
        {/* Hero Section */}
        <div className="relative bg-[#F9F7F7] min-h-screen">
          <WavyBackground className="w-screen mx-auto pb-40 px-16 align-middle mt-24">
            <p className="inline text-2xl md:text-4xl lg:text-7xl text-white font-bold inter-var text-left">
              With Love, Passion and{" "}
            </p>
            <AuroraText className="inline text-7xl font-bold">
              Talent
            </AuroraText>
            <p className="text-base md:text-lg mt-4 text-white font-normal inter-var text-left">
              Leverage the power of canvas to create a beautiful hero section
            </p>
          </WavyBackground>
        </div>
      </div>
    </div>
  );
}
