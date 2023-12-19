const {StickerMeta}=require('../lib')
let config = require('../config')
module.exports = {
	name: "sticker",
	category: "converter",
	desc: "converts Photo/Video To sticker",isQuoted: true,
    isMedia: {
        isQImage: true,
        isQVideo: true
    },
	async mbb({ msg,conn},{q}) {
        let buff = await msg.quoted.download()
        await conn.sendSticker(msg.from,buff)
    }}