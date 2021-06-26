"use strict"
const fs = require("fs");
const client = require("./config.js");
const { convertText } = require("./fontChanger.js");

//Fetching quiz data
const fetchData = () => {
	let questionList = [];
	fs.readFile("./quiz-questions.json", "utf8", (err, data) => {
		if (err) {
			console.log("There was an error getting the file :(");
		} else {
			console.log("Question list received");
			const parsedData = JSON.parse(data);
			parsedData.questions.forEach(question => {
				questionList.push(question);
			});
		}
	});
	return questionList;
}

//Global variables
const questionList = fetchData();
const quizData = [];
const roundData = [];
const timeouts = [];

//Tests whether or not the channel has started a trivia
const hasStarted = (data, channel) => {

	let started = false;
	data.forEach(c => {
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
class Round {
	constructor(channel, question) {
		this.channelName = channel;
		this.correctPlayers = [];
		this.allPlayers = [];
		this.question = question;
	}

	checkAnswer(user, text, channel){
		let hasAnswered = false;
		if (this.allPlayers.includes(convertText(user.username, "sans-serif"))){
			hasAnswered = true;
		} else {
			this.allPlayers.push(convertText(user.username, "sans-serif"));
		}

		if (hasAnswered){
			client.say(channel, `${convertText(user.username, "sans-serif")}, you have already given an answer to this question!`);
		} else if (text.toUpperCase().trim() === this.question.answer){
			this.correctPlayers.push(convertText(user.username, "sans-serif"));
		}
	}

	displayAnswers(q, channel){
		if (this.correctPlayers.length >= 2){
			const displayedPlayers = this.correctPlayers.join(", ").replace(/, (.+)$/, " and $1");
			client.say(channel, `The correct answer is ${q.answer}. Well done ${displayedPlayers} for getting the correct answer!`);
		} else if (this.correctPlayers.length === 1){
			client.say(channel, `The correct answer is ${q.answer}. Well done ${this.correctPlayers[0]} for getting the correct answer!`);
		} else {
			client.say(channel, `The correct answer is ${q.answer}. Nobody got the answer correct!`);
		}
	}
}

//Creates the quiz object
class Quiz {
	constructor(channel) {
		this.channelName = channel;
		this.players = [];
		this.playerData = [];
		this.lastRound = {};
	}

	updateScores(){
		
		this.lastRound.allPlayers.forEach(player => {
			if (!this.players.includes(player)){
				this.players.push(player);
				this.playerData.push({ username: player, score: 0 });
			}
		});

		this.lastRound.correctPlayers.forEach((player, i) => {
			this.playerData.forEach((user, j) => {

				if (convertText(user.username, "sans-serif") === player){
					this.playerData[j].score += Math.round(100 * (0.8 ** i));
				}
			});
		});
	}

	sortScores(){
		this.playerData.sort((a, b) => {
			return b.score - a.score;
		});
	}

	displayScores(channel){
		const dataToDisplay = this.playerData.map(person => person.username + " " + person.score).join(", ");
		if (dataToDisplay != ""){
			setTimeout(() => {
				client.say(channel, `Current scores: ${dataToDisplay}`)
			}, 3000);
		}
	}
}

const quizQuestion = (channel, user, command, text, fullQuizStarted = false) => {

	let questionStarted = hasStarted(roundData, channel);
	if (command === "!quizquestion" && !questionStarted){

		let q = getQuestion(); 
		client.say(channel, `${q.question} A. ${q.A}, B. ${q.B}, C. ${q.C}, D. ${q.D}. The answers will be revealed in 15 seconds.`);
		roundData.push(new Round(channel, q));

		setTimeout(() => {
			roundData.forEach((obj, i) => {

				if (obj.channelName === channel){
					obj.displayAnswers(q, channel);
					roundData.splice(i, 1);

					if (fullQuizStarted){
						quizData.forEach((object, j) => {
							if (object.channelName === channel){
								quizData[j].lastRound = obj;
								quizData[j].updateScores();
								quizData[j].sortScores();
								quizData[j].displayScores(channel);
							}
						});
					}
				}
			});
		}, 15000);
	}

	if (questionStarted){
		let channelIndex = roundData.findIndex(object => object.channelName === channel);
		if (questionStarted && /^[A-D] *$/.test(text.toUpperCase())){
			roundData[channelIndex].checkAnswer(user, text, channel);
		}
	}
}

const giveQuiz = (channel, user, command, text) => {

	if (command === "!quiz" && text === "help"){
		client.say(channel, "For each question, pick one of the 4 choices A, B, C or D. If your answer is correct, your score increases depending on how fast you answered compared to everyone else. The person at the end with the greatest score wins. To stop the quiz at anytime, type !quiz stop. Good luck :)");
	}

	if (command === "!quiz" && text === "stop"){
		for (let i=0; i<timeouts.length; i++) {
			clearTimeout(timeouts[i]);
		}
		quizData.forEach((obj, i) => {
			if (obj.channelName === channel){
				quizData.splice(i, 1);
			}
		});
	}

	let fullQuizStarted = hasStarted(quizData, channel);

	if (command === "!quiz" && !fullQuizStarted){
		
		quizData.push(new Quiz(channel));

		let noQuestions;
		if (text === ""){
			noQuestions = 10;
			client.say(channel, `A quiz is about to start. There will be 10 questions. Type '!quiz help' if you're unsure how to play.`);
		} else if (parseFloat(text) > 0 && Number.isInteger(parseFloat(text))){
			noQuestions = parseInt(text);
			client.say(channel, `A quiz is about to start. There will be ${noQuestions} questions. Type '!quiz help' if you're unsure how to play.`);
		} else {
			noQuestions = 0;
			client.say(channel, `That isn't a valid number of questions!`);
		}

		for (let i = 0; i <= noQuestions; i++){
			timeouts.push(setTimeout(() => {
				if (i != noQuestions){
					client.say(channel, `Question ${i + 1}:`);
					quizQuestion(channel, user, "!quizquestion", "", true);
				}

				if (i === noQuestions){
					quizData.forEach((obj, i) => {
						if (obj.channelName === channel){
							const dataToDisplay = obj.playerData.map(person => person.username + " " + person.score).join(", ");
							client.say(channel, `The quiz has finished. Final scores: ${dataToDisplay}. Congrats to ${obj.playerData[0].username} for winning the quiz!`);
							quizData.splice(i, 1);
						}
					});
				}
				
			}, i * 21000 + 30000));
		}
	}
}

module.exports = { giveQuiz, quizQuestion };