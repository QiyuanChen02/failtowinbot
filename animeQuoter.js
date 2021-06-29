const fetch = require("node-fetch");
const client = require("./config.js");

const fetchQuote = async(channel) => {
    try {
        const response = await fetch("https://animechan.vercel.app/api/random");
        const quoteObj = await response.json();
        client.say(channel, `${quoteObj.quote} (quote by ${quoteObj.character} from ${quoteObj.anime})`)
    } catch(e) {
        console.log(e);
    } 
}

const animeQuote = (channel, user, command, text) => {
    if (command === "!animequote"){
        fetchQuote(channel);
    }
}

module.exports = animeQuote;
