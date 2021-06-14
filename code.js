//Getting environmental variables
require("dotenv").config();

//Getting the tmi module and setting it up
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
client.connect().catch(console.error);

//Database management
const mongoose = require("mongoose");
const Gold = require("./gold.js")
const dbURL = process.env.DATABASE_URL;
mongoose.connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true });

//Takes a message and splits it into the command given and the actual text to change 
const splitText = (message) => {
	let command = message.split(" ")[0].toLowerCase();
	let text = message.substring(command.length + 1, message.length);
	return [command, text];
}

//Function to turn text into ascii letters
const convertText = (text, type) => {

	const fontNumbers = {
		"bold": ["1D400", "1D41A", "1D7CE"],
		"sans-serif": ["1D5A0", "1D5BA", "1D7E2"],
		"sans-serif-bold": ["1D5D4", "1D5EE", "1D7EC"],
		"monospace": ["1D670", "1D68A", "1D7F6"]
	}

	let changedText = "";
	for (let i = 0; i < text.length; i++){

		//Sets up info depending on type of data and the type of font to change it to
		let notSymbol = true;
		if ("ABCDEFGHIJKLMNOPQRSTUVWXYZ".includes(text[i])){
			var codeForFont = fontNumbers[type][0];
			var subtract = 65;
		} else if ("abcdefghijklmnopqrstuvwxyz".includes(text[i])){
			var codeForFont = fontNumbers[type][1];
			var subtract = 97;
		} else if ("0123456789".includes(text[i])){
			var codeForFont = fontNumbers[type][2];
			var subtract = 48;
		} else {
			notSymbol = false;
		}

		if (notSymbol){

			//Get ASCII of letter typed
			let asciiCode = text.codePointAt(i);

			//Get unicode number for the corresponding letter
			let letterNumber = parseInt(codeForFont, 16) + (asciiCode - subtract);

			//Add unicode letter to the new string 
			let unicodeOfLetter = "0x" + letterNumber.toString(16);
			changedText += String.fromCodePoint(unicodeOfLetter);

		} else {
			changedText += text[i];
		}
	}
	return changedText;
}

// const getGold = async (username) => {
// 	Gold.find().then(result => {
// 		// console.log("result: ", result);
// 		result.forEach(person => {
// 			//console.log("User", person.user);
// 			//console.log("Username", username);
// 			if (username === person.user){
// 				Gold.findByIdAndDelete(person._id)
// 				.then(result => console.log(result))
// 				.catch(err => console.log(err));
// 				return person.goldAmount;
// 			}
// 		});
// 		return 0;
// 	}).catch(err => console.log(err));
// }

// const saveGold = (username, goldAmount) => {
// 	gold = new Gold({ user: username, goldAmount: goldAmount });
// 	gold.save().then(result => console.log("I've reached it", result))
// 	.catch(err => console.log("error saving gold"));
// }

//Running the bot
client.on("connected", () => console.log("connected"));
client.on("message", (channel, user, message, self) => {
	
	if(self){ return };
	
	let command = splitText(message)[0];
	let text = splitText(message)[1];

	switch (command){
		case "!commands":
			client.say(channel, "!font1: bold text");
			client.say(channel, "!font2: sans-serif text");
			client.say(channel, "!font3: sans-serif bold text");
			client.say(channel, "!font4: monospace text");
			break;
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
		// case "!gold":
		// 	let amountGold = getGold(user.username);
		// 	console.log(amountGold);
		// 	amountGold += 1;
		// 	client.say(channel, "hello");
		// 	saveGold(user.username, amountGold);
		// 	break;
	}	
});