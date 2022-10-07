const cheerio = require('cheerio')
const fetch = require('node-fetch')
const axios = require('axios')

function brainly(question) {
    return new Promise((resolve, reject) => {
        axios.get(`https://brainly.in/app/ask?entry=hero&q=${encodeURIComponent(question)}`)
        .then(({ data }) => {
            let $ = cheerio.load(data)
            let hasil = []
            $('div.sg-animation-fade-in-fast').map(b=> {
                console.log(b)
            })
            
        })
    })
}

brainly('integral of sin x')