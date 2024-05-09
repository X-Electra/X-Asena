const {
  generateWAMessageFromContent,
  proto,
} = require("@whiskeysockets/baileys");
const { command } = require("../../lib");

command(
  {
    pattern: "c",
    fromMe: true,
  },
  async (m, match) => {
    const client = m.client;
    const image = {
      url: "https://mmg.whatsapp.net/o1/v/t62.7118-24/f1/m269/up-oil-image-f58c528d-ae9f-48e4-8b40-1c4e3f7721bf?ccb=9-4&oh=01_Q5AaICoMbL4iRuvGCxreuhRj8y7m7DETgXKngtX65Lay0G8y&oe=6656AF57&_nc_sid=000000&mms3=true",
      mimetype: "image/jpeg",
      fileSha256: "bW7OEYmSC4DXl34rO42v7K0544GbwyGuLCC+iu4i1T0=",
      fileLength: "373972",
      height: 2160,
      width: 3840,
      mediaKey: "OiA5dMB4D0od+TU+Ln2i+ohMxe8jR0C7/TowkLFgvKw=",
      fileEncSha256: "M6L//W6N3C98wwAmBNtg2HYOBc57jp24Pr86xj7a8uk=",
      directPath:
        "/o1/v/t62.7118-24/f1/m269/up-oil-image-f58c528d-ae9f-48e4-8b40-1c4e3f7721bf?ccb=9-4&oh=01_Q5AaICoMbL4iRuvGCxreuhRj8y7m7DETgXKngtX65Lay0G8y&oe=6656AF57&_nc_sid=000000",
      mediaKeyTimestamp: "1714377031",
      jpegThumbnail:
        "/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEABALDA4MChAODQ4SERATGCgaGBYWGDEjJR0oOjM9PDkzODdASFxOQERXRTc4UG1RV19iZ2hnPk1xeXBkeFxlZ2MBERISGBUYLxoaL2NCOEJjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY//AABEIABIAIAMBEQACEQEDEQH/xAGiAAABBQEBAQEBAQAAAAAAAAAAAQIDBAUGBwgJCgsQAAIBAwMCBAMFBQQEAAABfQECAwAEEQUSITFBBhNRYQcicRQygZGhCCNCscEVUtHwJDNicoIJChYXGBkaJSYnKCkqNDU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6g4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2drh4uPk5ebn6Onq8fLz9PX29/j5+gEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoLEQACAQIEBAMEBwUEBAABAncAAQIDEQQFITEGEkFRB2FxEyIygQgUQpGhscEJIzNS8BVictEKFiQ04SXxFxgZGiYnKCkqNTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqCg4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2dri4+Tl5ufo6ery8/T19vf4+fr/2gAMAwEAAhEDEQA/AOUknvpr2VIprh2LkAK5Petkrmbkoq7ZuaFpl59rEurPcRxLgrE8hQyE9B6gHB5xzg4qoxuzCrXUFdJv+u50ev2UupC3TTfMhRIpHKoAu9uNoOT7EZ5x/LGrFwV2dGFrwqN2Oeb+1dIvGs1keRHIHnMoYAcbiAx4xnHJwfyooyb2LxVOnNLnMCK/utO1GWezneGQOeVPUZzg+o46GrIIkN1eXWULyTMSxOefUkn9SadxaWOnl1e4+1WkEruEhEWFhfLTPkHIAGHyTkA+nUHOc5Pnd2TSg4w9123/AK/r0NXWru0kjLpFKlzaSFjlugYHcN3zA/xAD1XjpgxTjJ6G1RQkrSZ5/c/8fU3++f51uQWbR3jt5djFdy4bBxkZzg/iBSA6mYBdGiuAAJyI3Mo+8WBGDnrmspbnNd+2sbOknzdHW6k+e4aQoZm5cr6Z649qio9Dtw69+X9dEf/Z",
    };

    let msg = generateWAMessageFromContent(
      m.jid,
      {
        viewOnceMessage: {
          message: {
            interactiveMessage: {
              body: {
                text: "text"   },
              carouselMessage: {
                cards: [
                  {
                    header: {
                      imageMessage: image,
                      hasMediaAttachment: true,
                    },
                    body: { text: "Min. 50% Off" },
                    nativeFlowMessage: {
                      buttons: [
                        {
                          name: "cta_url",
                          buttonParamsJson:
                            '{"display_text":"SHOP NOW","url":"https:\\/\\/bit.ly\\/3vABQFh","webview_presentation":null}',
                        },
                      ],
                    },
                  },
                  {
                    header: {
                      imageMessage: image,
                      hasMediaAttachment: true,
                    },
                    body: { text: "Starting ₹1299" },
                    nativeFlowMessage: {
                      buttons: [
                        {
                          name: "cta_url",
                          buttonParamsJson:
                            '{"display_text":"SHOP NOW","url":"https:\\/\\/bit.ly\\/3xoUCjv","webview_presentation":null}',
                        },
                      ],
                    },
                  },
                  {
                    header: {
                      imageMessage: image,
                      hasMediaAttachment: true,
                    },
                    body: { text: "Under ₹499" },
                    nativeFlowMessage: {
                      buttons: [
                        {
                          name: "cta_url",
                          buttonParamsJson:
                            '{"display_text":"SHOP NOW","url":"https:\\/\\/bit.ly\\/3TKFdS7","webview_presentation":null}',
                        },
                      ],
                    },
                  },
                  {
                    header: {
                      imageMessage: image,
                      hasMediaAttachment: true,
                    },
                    body: { text: "50-80% Off" },
                    nativeFlowMessage: {
                      buttons: [
                        {
                          name: "cta_url",
                          buttonParamsJson:
                            '{"display_text":"SHOP NOW","url":"https:\\/\\/bit.ly\\/3TJjPN0","webview_presentation":null}',
                        },
                      ],
                    },
                  },
                  {
                    header: {
                      imageMessage: image,
                      hasMediaAttachment: true,
                    },
                    body: { text: "Starting ₹399" },
                    nativeFlowMessage: {
                      buttons: [
                        {
                          name: "cta_url",
                          buttonParamsJson:
                            '{"display_text":"SHOP NOW","url":"https:\\/\\/bit.ly\\/3vCrdSm","webview_presentation":null}',
                        },
                      ],
                    },
                  },
                  {
                    header: {
                      imageMessage: image,
                      hasMediaAttachment: true,
                    },
                    body: { text: "Starting ₹799" },
                    nativeFlowMessage: {
                      buttons: [
                        {
                          name: "cta_url",
                          buttonParamsJson:
                            '{"display_text":"SHOP NOW","url":"https:\\/\\/bit.ly\\/4aDsFmj","webview_presentation":null}',
                        },
                      ],
                    },
                  },
                ],
                messageVersion: 1,
              },
            },
          },
        },
      },
      {}
    );

    await client.relayMessage(msg.key.remoteJid, msg.message, {
      messageId: msg.key.id,
    });
  }
);
