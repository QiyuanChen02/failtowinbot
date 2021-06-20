//Requiring modules and connecting
const fetch = require("node-fetch");
const client = require("./config.js");

//Fetching quiz data
const fetchData = () => {
	let data = [];
	fetch("https://jsonkeeper.com/b/4KEW")
	.then(res => res.json())
	.then(data => {
		console.log("Question list received");
		data.questions.forEach(question => {
			questionList.push(question);
		});
	})
	.catch(err => console.log(err));
	return data;
}

//Global variables
let questionList = fetchData();
let triviaData = [];
let q;
let timer;

const channelIndex = (triviaData, channel) => {
	if (triviaData.length === 0){
		return undefined;
	} else {
		triviaData.forEach((c, index) => {
			if (c.channelName === channel){
				return index;
			}
		});
		return undefined;
	}
}

//Picks a random question from the list of questions
const getQuestion = () => {
	let questionNumber = Math.floor(Math.random() * questionList.length);
	return questionList[questionNumber];
}

function Game(channel){
	this.channelName = channel;
	this.players = [];
}

const triviaGame = (channel, user, command, text) => {

	let i = channelIndex(triviaData, channel);
	let triviaStarted = true;
	if (i === undefined){
		triviaStarted = false;
	} 
	if (command === "!trivia" || triviaStarted){

		if (command === "!trivia" && triviaStarted){
			client.say(channel, "A trivia is currently taking place!");
		}

		if (!triviaStarted){
			const game = new Game(channel);
			q = getQuestion(); 
			client.say(channel, `${q.question} A. ${q.A}, B. ${q.B}, C. ${q.C}, D. ${q.D}. You have 10 seconds to answer the questions`);
			triviaData.push(game);

			timer = setTimeout(() => {
				client.say(channel, `The trivia question has timed out...`);
				console.log(triviaData[0].players);
				triviaData = triviaData.filter(c => channel != c.channelName);
			}, 10000);
		}

		if (triviaStarted && text.toUpperCase() === q.answer){
			console.log("hello");
			triviaData[i].players.append(user.username);
		}
	}
}

module.exports = triviaGame;

// class Player{
// 	constructor(username, answer){
// 		this.username = username;
// 		this.answer = answer;
// 	}
// }