import { initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import fs from "fs";

const serviceAccount = JSON.parse(
    fs.readFileSync("./firebase-service-account.json", "utf8")
);

const app = initializeApp({
    credential: cert(serviceAccount)
});

export const adminAuth = getAuth(app);