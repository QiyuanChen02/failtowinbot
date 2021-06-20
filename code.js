//Getting modules
const client = require("./config.js");
const triviaGame = require("./trivia.js");
const changeFont = require("./fontChanger.js");

//Setting up
client.connect().catch(console.error);
client.on("connected", () => console.log("code.js connected"));

//Running the bot
client.on("message", (channel, user, message, self) => {

	if(self){ return };

	const regexpCommand = /^(\!\w+)?(?:\W+)?(.+)?/;
	let [, command, text] = message.match(regexpCommand);
	text = text || "";

	changeFont(channel, user, command, text);
	triviaGame(channel, user, command, text);


});
