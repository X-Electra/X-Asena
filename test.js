const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: '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',
});
const openai = new OpenAIApi(configuration);
openai.listModels().then((a) => {
  console.log(JSON.stringify(a.data,null,2));
});
