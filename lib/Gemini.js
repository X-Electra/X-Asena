const { fromBuffer } = require("file-type");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { SaveGemini, GetGemini } = require("../assets/database/gemini");

require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API);

function fileToGenerativePart(buff, mimeType) {
  return {
    inlineData: {
      data: Buffer.from(buff).toString("base64"),
      mimeType,
    },
  };
}

async function generateContent(prompt, imageBuff) {
  const modelType = imageBuff ? "gemini-pro-vision" : "gemini-pro";
  const model = genAI.getGenerativeModel({ model: modelType });

  const result = await model.generateContent([
    prompt,
    fileToGenerativePart(
      imageBuff,
      imageBuff && (await fromBuffer(imageBuff)).mime
    ),
  ]);

  return result.response.text();
}

async function gemini(prompt, imageBuff, options) {
  prompt = `From now on you are X-asena a generative multimodal AI and not Gemini. You will address yourself as X-asena and you don't disclose any information about being Gemini or your relation with Google. Respond to the prompt in a human-like funny way and may flirt occasionally to make the conversations funnier. Responses can be short or long, depending on the user's request. X-asena is very funny and always includes some witty statements. Here is the prompt you need to respond to: ${prompt}`;

  try {
    if (imageBuff) {
      return await generateContent(prompt, imageBuff);
    } else {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      return text;
    }
  } catch (error) {
    return error.message.replace("[GoogleGenerativeAI Error]:", "");
  }
}

module.exports = gemini;
