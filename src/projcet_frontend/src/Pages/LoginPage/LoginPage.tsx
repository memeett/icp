import { HttpAgent } from "@dfinity/agent";
import { AuthClient } from "@dfinity/auth-client";
import { useEffect, useState } from "react";
import { user } from "../../../../declarations/user/index.js";
import { session } from "../../../../declarations/session";
import Navbar from "../../components/Navbar";
import { Search } from "lucide-react";
import "../../style.css"

export default function LoginPage() {
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
    <div className="h-1 bg-[#F9F7F7]">
      <Navbar />

      {/* Hero Section */}
      <div className="pt-16">
        {" "}
        {/* Added padding to account for fixed navbar */}
        <div className="relative bg-[#DBE2EF]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="space-y-6">
                <h1 className="text-4xl md:text-5xl font-bold text-[#112D4E]">
                  Find the Perfect Freelancer for Your Project
                </h1>
                <p className="text-lg text-[#3F72AF]">
                  Connect with talented professionals worldwide and get your
                  projects done efficiently and affordably.
                </p>
                <div className="flex space-x-4">
                  <button className="bg-[#3FAF7D] hover:bg-opacity-90 text-white px-6 py-3 rounded-lg font-medium">
                    Hire a Freelancer
                  </button>
                  <button className="bg-[#FFC857] hover:bg-opacity-90 text-[#112D4E] px-6 py-3 rounded-lg font-medium">
                    Find Work
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
