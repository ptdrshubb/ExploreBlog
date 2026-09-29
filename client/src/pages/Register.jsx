import React, { useState } from "react";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import {
    createUserWithEmailAndPassword,
    sendEmailVerification,
    updateProfile
} from "firebase/auth";

import { auth } from "../firebase";

const Register = () => {

    const { navigate} = useAppContext();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name || !email || !password) {
            return toast.error("Please fill all fields");
        }

        if (password.length < 6) {
            return toast.error("Password must be at least 6 characters");
        }

        try {
            setLoading(true);

            // Create Firebase user
            const userCredential =
                await createUserWithEmailAndPassword(
                    auth,
                    email,
                    password
                );

            const firebaseUser = userCredential.user;

            // Save user's name in Firebase
            await updateProfile(firebaseUser, {
                displayName: name
            });
            // verification page url
            const actionCodeSettings = {
                url: `${window.location.origin}/verify-email`,
                handleCodeInApp: false
            };

            // Send verification email
            await sendEmailVerification(firebaseUser, actionCodeSettings);

            toast.success(
                "Verification link sent to your email!"
            );

            navigate("/login");

        } catch (error) {
            console.log("Firebase Register Error:", error);

            if (error.code === "auth/email-already-in-use") {
                toast.error("Email already registered");
            }
            else if (error.code === "auth/invalid-email") {
                toast.error("Invalid email address");
            }
            else if (error.code === "auth/weak-password") {
                toast.error("Password must be at least 6 characters");
            }
            else {
                toast.error(error.message);
            }

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4">

            <div className="w-full max-w-md">

                <h1 className="text-3xl font-semibold text-center mb-2">
                    Create Account
                </h1>

                <p className="text-gray-500 text-center mb-8">
                    Create your account to continue
                </p>

                <form
                    onSubmit={handleSubmit}
                    className="border border-gray-200 rounded-xl p-6 shadow-sm"
                >

                    {/* Name */}
                    <div className="mb-4">

                        <label className="block text-sm font-medium mb-2">
                            Name
                        </label>

                        <input
                            type="text"
                            placeholder="Enter your name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-primary"
                        />

                    </div>

                    {/* Email */}
                    <div className="mb-4">

                        <label className="block text-sm font-medium mb-2">
                            Email
                        </label>

                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-primary"
                        />

                    </div>

                    {/* Password */}
                    <div className="mb-6">

                        <label className="block text-sm font-medium mb-2">
                            Password
                        </label>

                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-primary"
                        />

                    </div>

                    {/* Register button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary text-white py-3 rounded-lg cursor-pointer disabled:opacity-60"
                    >
                        {loading ? "Creating Account..." : "Create Account"}
                    </button>

                    <p className="text-center text-sm text-gray-500 mt-5">

                        Already have an account?{" "}

                        <span
                            onClick={() => navigate("/login")}
                            className="text-primary cursor-pointer font-medium"
                        >
                            Login
                        </span>

                    </p>

                </form>

            </div>

        </div>
    );
};

export default Register;