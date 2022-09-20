const {search}  = require("yt-search")
search('mooonlight song').then(({videos})=>{console.log(videos)})