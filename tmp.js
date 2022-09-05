const yt = require('yt-search')
const { yta } = require('./lib/yotube')
yt.search('millie').then(({all})=>{yta(all[0].url).then((a)=>{
    console.log(a)
})})