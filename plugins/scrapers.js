const { command ,isPrivate , scraper } = require("../lib");
const {news_24,news_manorama,news_mathrubhumi,news_bbc,news_asianet,news_toi} = scraper

command(
    {
      pattern: "news ?(.*)",
      fromMe: isPrivate,
      desc: "Get News",
      type: "Search",
    },
    async (message, match,{prefix},client) => {
        if (!match) {
          await client.sendMessage(message.jid, {

            text: `Pick a News Provider`,
            buttonText: "View Provider",
            sections: [
              {
                title:`Malayalam News Scrapper`,
                rows: [
                  {
                    title:`24 News`,
                    rowId: `${prefix}news 24`,
                  },
                  {
                    title:`Asianet news`,
                    rowId: `${prefix}news asianet`,
                  },
                  {
                    title:`Manorama news`,
                    rowId: `${prefix}news manorama`,
                  },
                  {
                    title:`Mathrubhumi news`,
                    rowId: `${prefix}news mathrubhumi`,
                  }
                ],
              },
              {
                title:`English`,
                rows: [
                  {
                    title:`BBC News`,
                    rowId: `${prefix}news BBC`,
                  },
                  {
                    title:`Times Of India`,
                    rowId: `${prefix}news toi`,
                  }
                ]
              }
            ],
          });
        } else if (match === "24") {
          let rows = [];
          let news = await news_24();
          for (let i of news) {
            rows.push({
              title: i.header,
              description: `LINK : ${i.url}`,
              rowId: `  `,
            });
          }
          await client.sendMessage(message.jid, {
            text: `News From 24 News`,
            buttonText: "read news",
            sections: [
              {
                title:`Malayalam News Scrapper`,
                rows: rows,
              },
            ],
          });
        }else if (match === "toi") {
          let rows = [];
          let news = await news_toi();
          for (let i of news) {
            rows.push({
              title: i.header,
              description: `LINK : ${i.url}`,
              rowId: `  `,
            });
          }
          await client.sendMessage(message.jid, {
            text: `News From Times Of India`,
            buttonText: "read news",
            sections: [
              {
                title:`Malayalam News Scrapper`,
                rows: rows,
              },
            ],
          });
        }else if (match === "manorama") {
            let rows = [];
            let news = await news_manorama();
            for (let i of news) {
              rows.push({
                title: i.header,
                description: `LINK : ${i.url}`,
                rowId: `  `,
              });
            }
            await client.sendMessage(message.jid, {
              text: `News From Manorama News`,
              buttonText: "read news",
              sections: [
                {
                  title:`Malayalam News Scrapper`,
                  rows: rows,
                },
              ],
            });
          } else if (match === "asianet") {
          let rows = [];
          let news = await news_asianet();
          for (let i of news) {
            rows.push({
              title: i.header,
              description: `LINK : ${i.url}`,
              rowId: `  `,
            });
          }
          await client.sendMessage(message.jid, {
            text: `News From Asianet News`,
            buttonText: "read news",
            sections: [
              {
                title:`Malayalam News Scrapper`,
                rows: rows,
              },
            ],
          });
        } else if (match === "mathrubhumi") {
            let rows = [];
            let news = await news_mathrubhumi();
            for (let i of news) {
              rows.push({
                title: i.header,
                description: `LINK : ${i.url}`,
                rowId: `  `,
              });
            }
            await client.sendMessage(message.jid, {
              text: `News From Mathrubhumi News`,
              buttonText: "read news",
              sections: [
                {
                  title:`Malayalam News Scrapper`,
                  rows: rows,
                },
              ],
            });
          }else if (match === "BBC") {
            let rows = [];
            let news = await news_bbc();
            for (let i of news) {
              rows.push({
                title: i.header,
                description: `LINK : ${i.url}`,
                rowId: `  `,
              });
            }
            await client.sendMessage(message.jid, {
              text: `News From BBC News`,
              buttonText: "read news",
              sections: [
                {
                  title:`BBC news`,
                  rows: rows,
                },
              ],
            });
          } 
      }
  );

  