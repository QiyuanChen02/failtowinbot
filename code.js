//Getting modules
require("dotenv").config();
const tmi = require("tmi.js");
const options = require("./tmi-options.js");
const questionList = require("./trivia.js");
const convertText = require("./textConverter.js");

//Setting up
const client = new tmi.client(options);
client.connect().catch(console.error);
client.on("connected", () => console.log("connected"));

//Getting the question for the trivia
const getQuestion = () => {
	let questionNumber = Math.floor(Math.random() * questionList.length);
	let q = questionList[questionNumber];
	return q;
}

// const commands = {
// 	font: (text, type) => {
// 		convertText(text, type);
// 	}
// }

//Running the bot
client.on("message", (channel, user, message, self) => {
	
	if(self){ return };

	const regexpCommand = /^(\!\w+)?(?:\W+)?(.+)?/;
	let [raw, command, text] = message.match(regexpCommand);

	switch (command){
		case "!commands":
			client.say(channel, "!font1: bold text");
			client.say(channel, "!font2: sans-serif text");
			client.say(channel, "!font3: sans-serif bold text");
			client.say(channel, "!font4: monospace text");
			break;
		case "!font1":
			client.say(channel, convertText(text || "", "bold"));
			break;
		case "!font2":
			client.say(channel, convertText(text || "", "sans-serif"));
			break;
		case "!font3":
			client.say(channel, convertText(text || "", "sans-serif-bold"));
			break;
		case "!font4":
			client.say(channel, convertText(text || "", "monospace"));
			break;
	}

	if (command === "!trivia" || triviaStarted){
		if (!triviaStarted){
			q = getQuestion();
			client.say(channel, `${q.question} A. ${q.A}, B. ${q.B}, C. ${q.C}, D. ${q.D}`);
			triviaStarted = true;
		}

		if (triviaStarted && ["A", "B", "C", "D"].includes(text.toUpperCase())){
			if (text.toUpperCase() === q.answer){
				client.say(channel, "Congrats, you got the question correct!");
	
			} else {
				client.say(channel, `Incorrect! The correct answer is ${q.answer}`);
			}
			triviaStarted = false;
		}
	}
});

// const TriviaInfo = new Trivia()
// const Trivia = (channel) => {
//	this.channel = channel
// 	this.initiated = false;
// 	this.startedQuestions = false;
// 	this.players = [];
// 	this.getPlayers = (command, user) => {
// 		if (command === "!add") {
// 			this.players.push(user);
// 		}
// 	}
// }

// console.log(TriviaInfo);