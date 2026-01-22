import axios from "axios";

const MODELS = [
  "google/gemini-2.0-flash-exp",
  "meta-llama/llama-3.3-70b-instruct",
  "mistralai/mistral-small-3.1-24b-instruct",
  "google/gemma-3-4b-it",
  "deepseek/deepseek-r1-0528",
];

export const generateLLM = async (messages) => {
  let lastError = null;

  for (const model of MODELS) {
    try {
      const response = await axios.post(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          model,
          messages,
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
            "Content-Type": "application/json",
          },
          timeout: 20000,
        }
      );

      return {
        reply: response.data.choices[0]?.message?.content || "I apologize, but I couldn't generate a response.",
        model,
      };
    } catch (err) {
      console.error(`LLM failed for model: ${model}`, err.response?.data || err.message);
      lastError = err;
    }
  }

  if (lastError) {
    throw new Error(`All LLM models failed. Last error: ${lastError.message}`);
  }
  
  throw new Error("No models available");
};
