//Requiring modules and connecting
const fetch = require("node-fetch");
const client = require("./config.js");

//Fetching quiz data
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

//Global variables
let channelsTriviaStarted = [];
let q;
let timer;

//Picks a random question from the list of questions
const getQuestion = () => {
	let questionNumber = Math.floor(Math.random() * questionList.length);
	return questionList[questionNumber];
}

const triviaGame = (channel, user, command, text) => {

	let triviaStarted = false;
	if (channelsTriviaStarted.includes(channel)){
		triviaStarted = true;
	}

	if (command === "!trivia" || triviaStarted){

		if (command === "!trivia" && triviaStarted){
			client.say(channel, "A trivia is currently taking place!");
		}

		if (!triviaStarted){
			q = getQuestion(); 
			client.say(channel, `${q.question} A. ${q.A}, B. ${q.B}, C. ${q.C}, D. ${q.D}`);
			channelsTriviaStarted.push(channel);

			timer = setTimeout(() => {
				client.say(channel, `The trivia question has timed out...`);
				channelsTriviaStarted = channelsTriviaStarted.filter(channelName => channelName != channel);
			}, 30000);
		}

		if (triviaStarted && ["A", "B", "C", "D"].includes(text.toUpperCase())){
			
			if (text.toUpperCase() === q.answer){
				client.say(channel, `Congrats ${user.username}, you got the question correct!`);
	
			} else {
				client.say(channel, `Incorrect! The correct answer is ${q.answer}`);
			}

			channelsTriviaStarted = channelsTriviaStarted.filter(channelName => channelName != channel);
			clearTimeout(timer);
		}
	}
}

module.exports = triviaGame;