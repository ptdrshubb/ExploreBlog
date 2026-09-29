import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const AppContext = createContext();

export const AppProvider = ({ children }) => {

    const navigate = useNavigate();

    // Admin token
    const [token, setToken] = useState(null);

    // Normal user authentication
    const [userToken, setUserToken] = useState(null);
    const [user, setUser] = useState(null);

    const [blogs, setBlogs] = useState([]);
    const [input, setInput] = useState("");

    const fetchBlogs = async () => {
        try {
            const { data } = await axios.get("/api/blog/all");

            if (data.success) {
                setBlogs(data.blogs);
            } else {
                toast.error(data.message);
            }

        } catch (error) {
            toast.error(error.message);
        }
    };

    // Load saved authentication when application starts
    useEffect(() => {

        fetchBlogs();

        // Admin token
        const adminToken = localStorage.getItem("token");

        if (adminToken) {
            setToken(adminToken);
            axios.defaults.headers.common["Authorization"] = adminToken;
        }

        // User token
        const savedUserToken = localStorage.getItem("userToken");

        if (savedUserToken) {
            setUserToken(savedUserToken);
            // axios.defaults.headers.common["User-Authorization"] = savedUserToken;

            fetchUserProfile(savedUserToken);
        }

    }, []);

    // Get logged-in user's profile
    const fetchUserProfile = async (savedToken) => {

        try {

            const { data } = await axios.get(
                "/api/user/profile",
                {
                    headers: {
                        Authorization: savedToken
                    }
                }
            );

            if (data.success) {
                setUser(data.user);
            } else {
                localStorage.removeItem("userToken");
                setUserToken(null);
                setUser(null);
            }

        } catch (error) {

            localStorage.removeItem("userToken");
            setUserToken(null);
            setUser(null);

        }
    };

    // User logout
    const logoutUser = () => {

        localStorage.removeItem("userToken");

        setUserToken(null);
        setUser(null);

        // delete axios.defaults.headers.common["User-Authorization"];

        navigate("/");

        toast.success("Logged out successfully");
    };

    const value = {
        axios,
        navigate,

        // Admin
        token,
        setToken,

        // User
        userToken,
        setUserToken,
        user,
        setUser,
        fetchUserProfile,
        logoutUser,

        // Blogs
        blogs,
        setBlogs,

        // Search
        input,
        setInput
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    return useContext(AppContext);
};