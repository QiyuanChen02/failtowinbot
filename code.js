//Getting modules
const client = require("./config.js");
const { giveQuiz, quizQuestion } = require("./quizQuestion.js");
const { changeFont } = require("./fontChanger.js");
const animeQuote = require("./animeQuoter.js");
//const getJam = require("./jamGetter.js");

//Setting up
client.connect().catch(console.error);
client.on("connected", () => console.log("code.js connected"));

//Running the bot
client.on("message", (channel, user, message, self) => {

	
	if(self){ return };

	const regexpCommand = /^(\!\w+)?(?: +)?(.+)?/;
	let [, command, text] = message.match(regexpCommand);
	text = text || "";

	changeFont(channel, user, command, text);
	quizQuestion(channel, user, command, text);
	giveQuiz(channel, user, command, text);
	animeQuote(channel, user, command, text);
	//getJam(channel, user, command, text);

	if (command === "!dice"){
		text = text || 6;
		if (parseFloat(text) > 0 && Number.isInteger(parseFloat(text))){
			randomNumber = Math.floor(Math.random() * parseInt(text)) + 1;
			client.say(channel, randomNumber.toString());
		} else {
			client.say(channel, "That is not a valid number for a dice.");
		}
	}
	
});


