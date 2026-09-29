import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
    applyActionCode,
    checkActionCode,
    
} from "firebase/auth";

import { auth } from "../firebase";

const VerifyEmail = () => {

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const [status, setStatus] = useState("verifying");
    const [message, setMessage] = useState("");
   

    useEffect(() => {

        const verifyEmail = async () => {

            const mode = searchParams.get("mode");
            const oobCode = searchParams.get("oobCode");

            if (mode !== "verifyEmail" || !oobCode) {
                setStatus("error");
                setMessage("Invalid verification link.");
                return;
            }

            try {

                // Check whether verification code is valid
                await checkActionCode(auth, oobCode);

                // Apply email verification
                await applyActionCode(auth, oobCode);

                setStatus("success");
                setMessage(
                    "Your email has been verified successfully."
                );

            } catch (error) {

                console.log(
                    "Email Verification Error:",
                    error
                );

                setStatus("error");

                if (
                    error.code ===
                    "auth/expired-action-code"
                ) {
                    setMessage(
                        "This verification link has expired."
                    );
                }
                else if (
                    error.code ===
                    "auth/invalid-action-code"
                ) {
                    setMessage(
                        "This verification link is invalid or has already been used."
                    );
                }
                else {
                    setMessage(
                        "Unable to verify your email. Please request a new verification link."
                    );
                }
            }
        };

        verifyEmail();

    }, [searchParams]);


    const handleLogin = () => {
        navigate("/login");
    };


    return (
        <div className="min-h-screen flex items-center justify-center px-4">

            <div className="w-full max-w-md">

                <div className="border border-gray-200 rounded-xl p-8 shadow-sm text-center">

                    {status === "verifying" && (
                        <>
                            <div className="text-4xl mb-4">
                                ⏳
                            </div>

                            <h1 className="text-2xl font-semibold mb-3">
                                Verifying Email
                            </h1>

                            <p className="text-gray-500">
                                Please wait while we verify your email address...
                            </p>
                        </>
                    )}


                    {status === "success" && (
                        <>
                            <div className="text-5xl mb-4">
                                ✅
                            </div>

                            <h1 className="text-2xl font-semibold mb-3">
                                Email Verified Successfully
                            </h1>

                            <p className="text-gray-500 mb-6">
                                Your email address has been verified.
                                You can now login to your account.
                            </p>

                            <button
                                onClick={handleLogin}
                                className="w-full bg-primary text-white py-3 rounded-lg cursor-pointer"
                            >
                                Go to Login
                            </button>
                        </>
                    )}


                    {status === "error" && (
                        <>
                            <div className="text-5xl mb-4">
                                ❌
                            </div>

                            <h1 className="text-2xl font-semibold mb-3">
                                Verification Failed
                            </h1>

                            <p className="text-gray-500 mb-6">
                                {message}
                            </p>

                            <button
                                onClick={handleLogin}
                                className="w-full bg-primary text-white py-3 rounded-lg cursor-pointer"
                            >
                                Go to Login
                            </button>
                        </>
                    )}

                </div>

            </div>

        </div>
    );
};

export default VerifyEmail;