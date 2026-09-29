import jwt from "jsonwebtoken";

const userAuth = (req, res, next) => {
    try {
        const token = req.headers.authorization;

        if (!token) {
            return res.json({
                success: false,
                message: "Authentication token missing"
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.userId = decoded.userId;

        next();

    } catch (error) {
        return res.json({
            success: false,
            message: "Invalid or expired token"
        });
    }
};

export default userAuth;