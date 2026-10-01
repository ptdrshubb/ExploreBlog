import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const VerifyEmail = () => {

    const navigate = useNavigate();

    useEffect(() => {

        // Give Firebase a moment to complete the verification action
        const timer = setTimeout(() => {
            navigate("/login", { replace: true });
        }, 1000);

        return () => clearTimeout(timer);

    }, [navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center px-4">

            <div className="w-full max-w-md">

                <div className="border border-gray-200 rounded-xl p-8 shadow-sm text-center">

                    <div className="text-5xl mb-4">
                        ✅
                    </div>

                    <h1 className="text-2xl font-semibold mb-3">
                        Email Verified Successfully
                    </h1>

                    <p className="text-gray-500 mb-6">
                        Your email has been verified successfully.
                        Redirecting you to the login page...
                    </p>

                    <button
                        onClick={() => navigate("/login", { replace: true })}
                        className="w-full bg-primary text-white py-3 rounded-lg cursor-pointer"
                    >
                        Continue to Login
                    </button>

                </div>

            </div>

        </div>
    );
};

export default VerifyEmail;