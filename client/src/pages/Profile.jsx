import React, { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const Profile = () => {
    const {
        axios,
        user,
        setUser,
        userToken,
        navigate
    } = useAppContext();

    const [name, setName] = useState("");
    const [bio, setBio] = useState("");
    const [profileImage, setProfileImage] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!user) {
            navigate("/login");
            return;
        }

        setName(user.name || "");
        setBio(user.bio || "");
        setProfileImage(prev => user.profileImage || prev || "");
        setSelectedFile(null);
    }, [user, navigate]);

    // ================= SELECT IMAGE =================
    const handleImageChange = (e) => {
        const file = e.target.files?.[0];

        if (!file) return;

        // Only image files
        if (!file.type.startsWith("image/")) {
            toast.error("Please select an image file");
            return;
        }

        // 5 MB limit
        if (file.size > 5 * 1024 * 1024) {
            toast.error("Image size should be less than 5 MB");
            return;
        }

        setSelectedFile(file);

        // Preview selected image
        const previewUrl = URL.createObjectURL(file);
        setProfileImage(previewUrl);
    };

    // ================= IMAGE URL =================
    const handleUrlChange = (e) => {
        const url = e.target.value;

        // If user starts using URL, remove selected file
        setSelectedFile(null);
        setProfileImage(url);
    };

    // ================= UPDATE PROFILE =================
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name.trim()) {
            return toast.error("Name is required");
        }

        try {
            setLoading(true);

            const formData = new FormData();

            formData.append("name", name);
            formData.append("bio", bio);

            if (selectedFile) {
                formData.append("profileImage", selectedFile);
            }

            const { data } = await axios.put(
                "/api/user/profile",
                formData,
                {
                    headers: {
                        Authorization: userToken
                    }
                }
            );

            if (data.success) {
                const updatedUser = {
                    ...user,
                    ...data.user
                };

                setUser(updatedUser);

                setProfileImage(
                    data.user?.profileImage || profileImage
                );

                setSelectedFile(null);

                toast.success("Profile updated successfully");
            } else {
                toast.error(data.message);
            }

        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Failed to update profile"
            );
        } finally {
            setLoading(false);
        }
    };

    if (!user) return null;

    return (
        <div className="min-h-[80vh] flex justify-center items-center px-4 py-10">

            <div className="w-full max-w-xl bg-white border border-gray-200 rounded-2xl shadow-sm p-6 sm:p-8">

                {/* ================= PROFILE HEADER ================= */}
                <div className="text-center mb-8">

                    <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center">

                        {profileImage ? (
                            <img
                                src={profileImage}
                                alt="Profile"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <span className="text-3xl font-semibold text-gray-500">
                                {name?.charAt(0)?.toUpperCase()}
                            </span>
                        )}

                    </div>

                    <h1 className="text-2xl font-semibold text-gray-800">
                        My Profile
                    </h1>

                    <p className="text-gray-500 text-sm mt-1">
                        Manage your account information
                    </p>

                </div>


                <form onSubmit={handleSubmit} className="space-y-5">

                    {/* ================= NAME ================= */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Name
                        </label>

                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-primary"
                            placeholder="Enter your name"
                        />
                    </div>


                    {/* ================= EMAIL ================= */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email
                        </label>

                        <input
                            type="email"
                            value={user.email}
                            disabled
                            className="w-full border border-gray-200 bg-gray-100 rounded-lg px-4 py-3 outline-none text-gray-500"
                        />
                    </div>


                    {/* ================= BIO ================= */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Bio
                        </label>

                        <textarea
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            placeholder="Write something about yourself..."
                            rows="4"
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-primary resize-none"
                        />
                    </div>


                    {/* ================= UPLOAD IMAGE ================= */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Profile Photo
                        </label>

                        <label
                            htmlFor="profileImage"
                            className="w-full border-2 border-dashed border-gray-300 rounded-lg px-4 py-6 flex flex-col items-center justify-center cursor-pointer hover:border-primary transition"
                        >
                            <span className="text-primary font-medium">
                                Choose Photo
                            </span>

                            <span className="text-xs text-gray-500 mt-1">
                                JPG, JPEG, PNG or WEBP (Max 5 MB)
                            </span>

                            <input
                                id="profileImage"
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                            />
                        </label>

                        {selectedFile && (
                            <p className="text-xs text-gray-500 mt-2">
                                Selected: {selectedFile.name}
                            </p>
                        )}
                    </div>


                    {/* ================= OR ================= */}
                    <div className="flex items-center gap-3">
                        <div className="flex-1 h-px bg-gray-200"></div>

                        <span className="text-sm text-gray-400">
                            OR
                        </span>

                        <div className="flex-1 h-px bg-gray-200"></div>
                    </div>


                    {/* ================= IMAGE URL ================= */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Profile Image URL
                        </label>

                        <input
                            type="text"
                            value={selectedFile ? "" : profileImage}
                            onChange={handleUrlChange}
                            placeholder="Paste direct image URL"
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-primary"
                        />

                        <p className="text-xs text-gray-500 mt-2">
                            Use a direct image URL ending with .jpg, .png, .jpeg, etc.
                        </p>
                    </div>


                    {/* ================= UPDATE BUTTON ================= */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary text-white py-3 rounded-lg font-medium cursor-pointer disabled:opacity-60"
                    >
                        {loading ? "Updating..." : "Update Profile"}
                    </button>

                </form>

            </div>

        </div>
    );
};

export default Profile;