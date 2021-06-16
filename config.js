//Setting tmi module up
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
	channels: [ "failtowinbot", "failtowinpro" ]
};

const client = new tmi.client(options);

module.exports = client;