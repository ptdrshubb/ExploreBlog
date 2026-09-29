import express from "express";

import {
    subscribeUser,
    getAllSubscribers
} from "../controllers/subscriberController.js";

import auth from "../middleware/auth.js";

const subscriberRouter = express.Router();


// Public newsletter subscription
subscriberRouter.post("/subscribe", subscribeUser);


// Admin only - get subscribers
subscriberRouter.get("/all", auth, getAllSubscribers);


export default subscriberRouter;