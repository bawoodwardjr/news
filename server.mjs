import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/generate", async (req, res) => {
  const { topic, region, depth, style } = req.body;

  const prompt = `
Write a real ${depth.toLowerCase()} news article about "${topic}"${region ? ` in ${region}` : ""}.
Write it with a ${style.toLowerCase()} bias. Leave out title and author.
Make sure the content is relevant and is recent news. Use real sources and real information. Do not make fake news. Only write real, recent events.

Headline:
`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 100,
    });

    const article = completion.choices[0].message.content;
    res.json({ article });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error generating article" });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
