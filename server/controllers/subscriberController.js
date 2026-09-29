import Subscriber from "../models/Subscriber.js";

export const subscribeUser = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.json({
                success: false,
                message: "Email is required"
            });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            return res.json({
                success: false,
                message: "Please enter a valid email address"
            });
        }

        const existingSubscriber = await Subscriber.findOne({
            email: email.toLowerCase()
        });

        if (existingSubscriber) {
            return res.json({
                success: false,
                message: "This email is already subscribed"
            });
        }

        await Subscriber.create({
            email: email.toLowerCase()
        });

        res.json({
            success: true,
            message: "Successfully subscribed to our newsletter!"
        });

    } catch (error) {
        res.json({
            success: false,
            message: error.message
        });
    }
};


// Get all subscribers - Admin
export const getAllSubscribers = async (req, res) => {
    try {
        const subscribers = await Subscriber
            .find({})
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            subscribers
        });

    } catch (error) {
        res.json({
            success: false,
            message: error.message
        });
    }
};