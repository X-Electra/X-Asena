# [SCAN QR](https://x-asena-qr.herokuapp.com)

# [DEPLOY](https://heroku.com/deploy?template=https://github.com/X-Electra/X-Asena) 

# Using X-asena 
## Creating a plugin 
```javascript
const { command ,isPrivate} = require("../lib/");//importing functions 


command(
  {
    pattern: "ping", //command
    fromMe: isPrivate, /*need to respond for everyone's message
true : only from sudo numbers
false : from everyone
isPrivate same as false but will be considered as true if worktype is private*/
    desc: "To check ping",//description of the command
    type: "user",//command type 
  },
  async (message, match) => {
    /*


PLUGIN CONTENT HERE


*/
  }
);

```
## Sending Messages
### Replying
```javascript
message.reply('Hi')
```

### Media
```javascript
let content = 'https://wallpaperaccess.com/full/5531321.jpg'//can also use buffer
message.sendMessage(content,{}/*options*/,'image'/*change to audio , video while sending audio or video */)
```

### Sticker 

```javascript

message.sendMessage(
      'url or buffer of image or video(max 10 seconds)',
      { packname: config.PACKNAME, author: config.AUTHOR },
      "sticker"
    );

```

### Template Message

```javascript

const templateButtons = [
    {index: 1, urlButton: {displayText: '⭐ Star Baileys on GitHub!', url: 'https://github.com/adiwajshing/Baileys'}},
    {index: 2, quickReplyButton: {displayText: 'This is a reply, just like normal buttons!', id: 'id-like-buttons-message'}},
]

const templateMessage = {
    text: "Hi it's a template message",
    footer: 'Hello World',
    templateButtons: templateButtons
}

await message.sendMessage(templateMessage, {}, "template");

```
