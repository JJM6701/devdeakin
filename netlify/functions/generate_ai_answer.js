import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.VITE_OPENAI_API_KEY });

exports.handler = async function (event, context) {
  // Parse the user prompt from the request body
  const { prompt } = JSON.parse(event.body);

  try {
    // Send the prompt to OpenAI and request a completion
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful code assistant on a website that users can submit code that they either need help with or are showcasing. You are reading blocks of code submitted on the site, give a summary of what the code does and an improvement or help fix it if there looks to be an issue. Your answer should be concise and straight to the point. DO NOT ask any further questions",
        },
        { role: "user", content: prompt },
      ],
    });

    // Extract the AI-generated answer
    const answer = completion.choices[0].message.content.trim();

    // Return the answer
    return {
      statusCode: 200,
      body: JSON.stringify({ answer }),
    };
  } catch (error) {
    // Handle and return any errors that occur
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error.response ? error.response.data : error.message,
      }),
    };
  }
};
