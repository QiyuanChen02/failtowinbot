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
let quizData = [];
let roundData = [];

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
		if (this.allPlayers.includes(user.username)){
			hasAnswered = true;
		} else {
			this.allPlayers.push(user.username);
		}

		if (hasAnswered){
			client.say(channel, `${user.username}, you have already given an answer to this question!`);
		} else if (text.toUpperCase() === this.question.answer){
			this.correctPlayers.push(user.username);
		}
	}

	displayAnswers(q, channel){
		if (this.correctPlayers.length >= 2){
			const displayedPlayers = this.correctPlayers.join(", ").replace(/, (\w+)$/, " and $1");
			client.say(channel, `The correct answer is ${q.answer}. Well done ${displayedPlayers} for getting the correct answer!`);
		} else if (this.correctPlayers.length === 1){
			client.say(channel, `The correct answer is ${q.answer}. Well done ${this.correctPlayers[0]} for getting the correct answer!`);
		} else {
			client.say(channel, `The correct answer is ${q.answer}. Nobody got the answer correct!`);
		}
	}
}

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

				if (user.username === player){
					this.playerData[j].score += Math.round(100 * (0.8 ** i));
				}
			});
		});
	}

	displayScores(channel){
		const dataToDisplay = this.playerData.map(person => person.username + " " + person.score).join(", ");
		setTimeout(() => {
			client.say(channel, `Current scores: ${dataToDisplay}`)
		}, 3000);
	}
}

const quizQuestion = (channel, user, command, text, fullQuizStarted = false) => {

	let questionStarted = hasStarted(roundData, channel);
	if (command === "!quizquestion" || questionStarted){

		if (command === "!quizquestion" && questionStarted){
			client.say(channel, "A quiz is already taking place!");
		}

		if (!questionStarted){
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
									quizData[j].displayScores(channel);
								}
							});
						}
					}
				});
			}, 15000);
		}

		let channelIndex = roundData.findIndex(object => object.channelName === channel);
		if (questionStarted && ["A", "B", "C", "D"].includes(text.toUpperCase())){
			roundData[channelIndex].checkAnswer(user, text, channel);
		}
		
	}

}

const giveQuiz = (channel, user, command, text) => {

	if (command === "!quizhelp"){
		client.say(channel, "There will be 10 questions. For each question, pick one of the 4 choices A, B, C or D. If your answer is correct, your score increases depending on how fast you answered compared to everyone else. The person at the end with the greatest score wins. Good luck");
	}

	let fullQuizStarted = hasStarted(quizData, channel);
	if (command === "!quiza" && !fullQuizStarted){
		
		quizData.push(new Quiz(channel));

		client.say(channel, "The quiz will start in 10 seconds. Type '!quizhelp' if you're unsure how to play.");
		for (let i = 0; i <= 10; i++){
			setTimeout(() => {
				if (i != 10){
					quizQuestion(channel, user, "!quizquestion", "", true);
				}

				if (i === 10){
					quizData.forEach((obj, i) => {
						if (obj.channelName === channel){
							const dataToDisplay = obj.playerData.map(person => person.username + " " + person.score).join(", ");
							client.say(channel, `The quiz has finished. Final scores: ${dataToDisplay}`)
							quizData.splice(i, 1);
						}
					});
				}
				
			}, i * 21000 + 10000);
		}
	}
}

module.exports = { giveQuiz, quizQuestion };
