import { GoogleGenAI } from "@google/genai";
import OpenAI from "openai";


// ===============================
// Gemini AI
// ===============================
const gemini = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});


// ===============================
// OpenAI
// ===============================
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});


// ===============================
// Generate Content
// Gemini → OpenAI Fallback
// ===============================
async function main(prompt) {

    // --------------------------------
    // 1. Try Gemini first
    // --------------------------------
    try {

        console.log("Trying Gemini AI...");

        const response = await gemini.models.generateContent({
            model: "gemini-3.8-flash",
            contents: prompt,
        });

        console.log("Gemini AI response received.");

        return response.text;

    } catch (geminiError) {

        console.log(
            "Gemini failed:",
            geminiError.message
        );

        console.log(
            "Switching to OpenAI..."
        );
    }


    // --------------------------------
    // 2. Gemini failed → OpenAI
    // --------------------------------
    try {

        console.log("Trying OpenAI...");

        const response = await openai.responses.create({
            model: "gpt-5.6-luna",
            input: prompt,
        });

        console.log("OpenAI response received.");

        return response.output_text;

    } catch (openaiError) {

        console.log(
            "OpenAI failed:",
            openaiError.message
        );

        throw new Error(
            "Both Gemini and OpenAI are currently unavailable. Please try again later."
        );
    }
}


export default main;