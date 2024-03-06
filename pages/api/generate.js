import * as dotenv from 'dotenv';
import { GoogleGenerativeAI } from "@google/generative-ai";
import EditOutput from './EditOutput'; // Assuming you have some custom logic here

dotenv.config({ path: __dirname + '/.env' });

const genAI = new GoogleGenerativeAI(process.env.API_KEY);

export default async function(req, res) {
    const prompt = req.body.prompt || '';
    if (prompt.trim().length === 0) {
        res.status(400).json({
            error: {
                message: "Please enter a valid prompt"
            }
        });
        return;
    }

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent(`convert ${prompt} into terraform scripts`);
        const response = await result.response;
        const text = await response.text(); // Ensure to await the text() as it returns a Promise

        res.status(200).json({ result: text });
    } catch (error) {
        console.error(`Error with Google Generative AI request: ${error.message}`);
        res.status(500).json({
            error: {
                message: 'An error occurred during your request'
            }
        });
    }
}
