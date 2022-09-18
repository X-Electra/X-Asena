const { getUrl } = require("./lib");

let body = `#install https://gist.github.com/Neeraj-x0/4914a8aa26b6e346b582a51246d5a17b https://gist.github.com/Neeraj-x0/4914a8aa26b6e346b582a51246d5a17b
https://gist.github.com/Neeraj-x0/4914a8aa26b6e346b582a51246d5a17b
https://gist.github.com/Neeraj-x0/4914a8aa26b6e346b582a51246d5a17b 
`;

console.log(getUrl(body));
