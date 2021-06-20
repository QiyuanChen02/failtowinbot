const client = require("./config.js");

//Function to turn text into ascii letters
const convertText = (text, type) => {

	const fontNumbers = {
		"bold": ["1D400", "1D41A", "1D7CE"],
		"sans-serif": ["1D5A0", "1D5BA", "1D7E2"],
		"sans-serif-bold": ["1D5D4", "1D5EE", "1D7EC"],
		"monospace": ["1D670", "1D68A", "1D7F6"]
	}

    if (text.length === 0){
        return "No text entered";
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

const changeFont = (channel, user, command, text) => {
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
}

module.exports = changeFont;