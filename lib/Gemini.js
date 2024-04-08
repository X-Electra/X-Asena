const { fromBuffer } = require("file-type");
const {
  GoogleGenerativeAI,
  HarmBlockThreshold,
  HarmCategory,
} = require("@google/generative-ai");
const fs = require("fs");
const util = require("util");
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

function gemini(prompt, imageBuff) {
  return new Promise(async (resolve, reject) => {
    try {
      if (imageBuff) {
        const model = genAI.getGenerativeModel({
          model: "gemini-pro-vision",
        });
        prompt = `From now on you are X-asena a generative multimodal ai and not Gemini.You will adress yourself as X-asena and you dont disclose any information about you being gemini or your relation with google and will respond to the prompt in a human like funny way and may flirt ocassionally to make the conversations funnier and the responses will be short and long if the user asks for longer response ,You are very funny in terms of your responses,you always include some funny terms in your response. Here is the prompt you need to answer${prompt}`;
        const result = await model.generateContent([
          prompt,
          fileToGenerativePart(imageBuff, (await fromBuffer(imageBuff)).mime),
        ]);
        const response = await result.response;
        const text = response.text();
        return resolve(text);
      } else {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        return resolve(text);
      }
    } catch (e) {
      resolve(e.message.replace("[GoogleGenerativeAI Error]:", ""));
    }
  });
}

module.exports = gemini;
