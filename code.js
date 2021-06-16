//Getting modules
require("dotenv").config();
const client = require("./config.js");
const triviaGame = require("./trivia.js");
const convertText = require("./textConverter.js");

//Setting up
client.connect().catch(console.error);
client.on("connected", () => console.log("code.js connected"));

//Running the bot
client.on("message", (channel, user, message, self) => {

	if(self){ return };

	const regexpCommand = /^(\^\w+)?(?:\W+)?(.+)?/;
	let [raw, command, text] = message.match(regexpCommand);
	text = text || "";

	switch (command){
		case "!font1":
			client.say(channel, convertText(text, "bold"));
			break;
		case "!font2":
			client.say(channel, convertText(text, "sans-serif"));
			break;
		case "!font3":
			client.say(channel, convertText(text, "sans-serif-bold"));
			break;
		case "!font4":
			client.say(channel, convertText(text, "monospace"));
			break;
	}

	triviaGame(channel, user, command, text);

});
