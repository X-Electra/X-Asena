const { fromBuffer } = require("file-type");
const { getBuffer } = require("./lib");
getBuffer("https://archive.org/download/Babyshark_201905/babyshark%20teeth.mp4").then(
  async (data) => {
    let type =await  fromBuffer(data);
    console.log(type);
  }
);
