//Setting tmi module up
require("dotenv").config();
const tmi = require("tmi.js");
const options = {
	options: { 
		debug: false, 
    },
	connection: {
		reconnect: true,
		secure: true
	},
	identity: {
		username: process.env.TWITCH_BOT_USERNAME,
		password: process.env.TWITCH_OAUTH_TOKEN
	},
	channels: ["failtowinpro", "chubbehmouse"]
};

const client = new tmi.client(options);

module.exports = client;