import React, { useState } from "react";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

import {
    signInWithEmailAndPassword,
    signOut,
    sendPasswordResetEmail

} from "firebase/auth";

import { auth } from "../firebase";

const UserLogin = () => {

    const {
        axios,
        navigate,
        setUserToken,
        setUser,
        setToken
    } = useAppContext();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);

    const handleForgotPassword = async () => {

        if (!email) {
            return toast.error(
                "Please enter your email address first"
            );
        }

        try {

            setLoading(true);

            await sendPasswordResetEmail(
                auth,
                email
            );

            toast.success(
                "Password reset link sent to your email!"
            );

        } catch (error) {

            console.log(
                "Forgot Password Error:",
                error
            );

            if (
                error.code ===
                "auth/invalid-email"
            ) {
                toast.error(
                    "Please enter a valid email address"
                );
            }
            else if (
                error.code ===
                "auth/user-not-found"
            ) {
                toast.error(
                    "No account found with this email"
                );
            }
            else {
                toast.error(
                    error.message ||
                    "Unable to send password reset email"
                );
            }

        } finally {

            setLoading(false);

        }
    };


    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!email || !password) {
            return toast.error("Please fill all fields");
        }

        try {

            setLoading(true);


            // =================================================
            // 1. TRY FIREBASE USER LOGIN
            // =================================================

            try {

                const userCredential =
                    await signInWithEmailAndPassword(
                        auth,
                        email,
                        password
                    );

                const firebaseUser =
                    userCredential.user;


                // Refresh Firebase user
                await firebaseUser.reload();


                // =================================================
                // 2. CHECK EMAIL VERIFICATION
                // =================================================

                if (!firebaseUser.emailVerified) {

                    await signOut(auth);

                    return toast.error(
                        "Please verify your email before login"
                    );
                }


                // =================================================
                // 3. GET FIREBASE ID TOKEN
                // =================================================

                const idToken =
                    await firebaseUser.getIdToken();


                // =================================================
                // 4. SYNC FIREBASE USER WITH BACKEND
                // =================================================

                const { data: userData } =
                    await axios.post(
                        "/api/user/firebase-sync",
                        {
                            idToken,
                            name: firebaseUser.displayName
                        }
                    );


                // =================================================
                // 5. BACKEND SUCCESS
                // =================================================

                if (userData.success) {

                    localStorage.setItem(
                        "userToken",
                        userData.token
                    );

                    setUserToken(userData.token);

                    setUser(userData.user);

                    toast.success("Login successful");

                    navigate("/");

                    return;
                }


                // Backend rejected Firebase user
                await signOut(auth);

                return toast.error(
                    userData.message ||
                    "Authentication failed"
                );

            } catch (firebaseError) {

                console.log(
                    "Firebase Login Failed:",
                    firebaseError
                );


                // =================================================
                // 6. FIREBASE LOGIN FAILED
                //    TRY ADMIN LOGIN
                // =================================================

                const adminResponse =
                    await axios.post(
                        "/api/admin/login",
                        {
                            email,
                            password
                        }
                    );

                const adminData =
                    adminResponse.data;


                // =================================================
                // 7. ADMIN LOGIN SUCCESS
                // =================================================

                if (adminData.success) {

                    localStorage.setItem(
                        "token",
                        adminData.token
                    );

                    setToken(adminData.token);


                    // Admin API Authorization
                    axios.defaults.headers.common[
                        "Authorization"
                    ] = adminData.token;


                    toast.success(
                        "Admin login successful"
                    );

                    navigate("/admin");

                    return;
                }


                // =================================================
                // 8. BOTH LOGIN FAILED
                // =================================================

                if (
                    firebaseError.code ===
                    "auth/invalid-email"
                ) {

                    return toast.error(
                        "Invalid email address"
                    );
                }

                if (
                    firebaseError.code ===
                    "auth/user-disabled"
                ) {

                    return toast.error(
                        "This account has been disabled"
                    );
                }

                return toast.error(
                    "Invalid email or password"
                );
            }

        } catch (error) {

            console.log(
                "Login Error:",
                error
            );

            toast.error(
                error.response?.data?.message ||
                "Login failed"
            );

        } finally {

            setLoading(false);

        }
    };


    return (
        <div className="min-h-screen flex items-center justify-center px-4">

            <div className="w-full max-w-md">

                <h1 className="text-3xl font-semibold text-center mb-2">
                    Welcome Back
                </h1>

                <p className="text-gray-500 text-center mb-8">
                    Login to continue
                </p>


                <form
                    onSubmit={handleSubmit}
                    className="border border-gray-200 rounded-xl p-6 shadow-sm"
                >

                    {/* Email */}

                    <div className="mb-4">

                        <label className="block text-sm font-medium mb-2">
                            Email
                        </label>

                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) =>
                                setEmail(e.target.value)
                            }
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
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-primary"
                        />

                    </div>

                    <div className="text-right mt-2">

                        <span
                            onClick={handleForgotPassword}
                            className="text-sm text-primary cursor-pointer font-medium"
                        >
                            Forgot Password?
                        </span>

                    </div>


                    {/* Login Button */}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary text-white py-3 rounded-lg cursor-pointer disabled:opacity-60"
                    >
                        {loading
                            ? "Logging in..."
                            : "Login"}
                    </button>


                    {/* Register */}

                    <p className="text-center text-sm text-gray-500 mt-5">

                        Don't have an account?{" "}

                        <span
                            onClick={() =>
                                navigate("/register")
                            }
                            className="text-primary cursor-pointer font-medium"
                        >
                            Register
                        </span>

                    </p>

                </form>

            </div>

        </div>
    );
};

export default UserLogin;