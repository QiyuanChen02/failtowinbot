//Requiring modules and connecting
const fetch = require("node-fetch");
const client = require("./config.js");

//Fetching quiz data
const fetchData = () => {
	let questionList = [];
	fetch("https://jsonkeeper.com/b/4KEW")
	.then(res => res.json())
	.then(data => {
		console.log("Question list received");
		data.questions.forEach(question => {
			questionList.push(question);
		});
	})
	.catch(err => console.log(err));
	return questionList;
}

//Global variables
let questionList = fetchData();
let triviaData = [];
let timer;

//Tests whether or not the channel has started a trivia
const hasStarted = (triviaData, channel) => {

	let started = false;
	triviaData.forEach((c, index) => {
		if (c.channelName === channel){
			started = true;
		}
	});
	return started;
}

//Picks a random question from the list of questions
const getQuestion = () => {
	let questionNumber = Math.floor(Math.random() * questionList.length);
	return questionList[questionNumber];
}

//Creates the game object
class Game {
	constructor(channel, question) {
		this.channelName = channel;
		this.correctPlayers = [];
		this.allPlayers = [];
		this.question = question;
	}
}

const triviaGame = (channel, user, command, text) => {

	let triviaStarted = hasStarted(triviaData, channel);

	if (command === "!quiz" || triviaStarted){

		let channelIndex = triviaData.findIndex(object => object.channelName === channel);

		if (!triviaStarted){
			let q = getQuestion(); 
			client.say(channel, `${q.question} A. ${q.A}, B. ${q.B}, C. ${q.C}, D. ${q.D}. The answers will be revealed in 15 seconds.`);
			const game = new Game(channel, q);
			triviaData.push(game);

			timer = setTimeout(() => {
				triviaData.forEach((obj, i) => {
					if (obj.channelName === channel){
						if (obj.correctPlayers.length >= 2){
							const displayedPlayers = obj.correctPlayers.join(", ").replace(/, (\w+)$/, " and $1");
							client.say(channel, `The correct answer is ${q.answer}. Well done ${displayedPlayers} for getting the correct answer!`);
						} else if (obj.correctPlayers.length === 1){
							client.say(channel, `The correct answer is ${q.answer}. Well done ${obj.correctPlayers[0]} for getting the correct answer!`);
						} else {
							client.say(channel, `The correct answer is ${q.answer}. Nobody got the answer correct!`);
						}
						triviaData.splice(i, 1);
					}
				});
			}, 15000);
		}

		if (triviaStarted && ["A", "B", "C", "D"].includes(text.toUpperCase())){

			let hasAnswered = false;
			if (triviaData[channelIndex].allPlayers.includes(user.username)){
				hasAnswered = true;
			} else {
				triviaData[channelIndex].allPlayers.push(user.username);
			}

			if (hasAnswered){
				client.say(channel, `${user.username}, you have already given an answer to this question!`);
			} else if (text.toUpperCase() === triviaData[channelIndex].question.answer){
				triviaData[channelIndex].correctPlayers.push(user.username);
			}
		}
	}
}

module.exports = triviaGame;