const tmi = require('tmi.js');

const options = {
	options: { 
		debug: false, 
    },
	connection: {
		reconnect: true,
		secure: true
	},
	identity: {
		username: "failtowinbot",
		password: "oauth:15y6lj6hq4sr1h5zsfgnaebdarn0h6"
	},
	channels: [ "failtowinbot", "failtowinpro" ]
};

const client = new tmi.client(options);

client.connect().catch(console.error);

// client.on("connected", () => {
//     setInterval(() => {
//         client.action("failtowinbot", "Hello, this bot is now connected");
//     }, 2000);
// });

const convertText = (text) => {

	let changedText = "";

	for (let i = 0; i < text.length; i++){

		if ("abcdefghijklmnopqrstuvwxyz".includes(text[i])){
			var codeForFont = 0x1D41A;
			var subtract = 97;
			var isLetter = true;
		} else if ("ABCDEFGHIJKLMNOPQRSTUVWXYZ".includes(text[i])){
			var codeForFont = 0x1D400;
			var subtract = 65;
			var isLetter = true;
		} else {
			var isLetter = false;
		}

		if (isLetter){
			let asciiCode = text.codePointAt(i);
			console.log("ascii:", asciiCode);

			let letterNumber = parseInt(codeForFont, 10) + (asciiCode - subtract);
			console.log("letterNumber: ", letterNumber);

			let unicodeOfLetter = "0x" + letterNumber.toString(16);
			console.log("unicodeOfLetter: ", unicodeOfLetter);

			changedText += String.fromCodePoint(unicodeOfLetter);
		} else {
			changedText += text[i];
		}
	}
	return changedText;
}

client.on("connected", () => console.log("connected"));

client.on("message", (channel, user, message, self) => {
	
	if(self){ return };
	
	if(message.substring(0, 9).toLowerCase() === "!makebold"){
		client.say(channel, convertText(message.substring(10, message.length)))
	}

});

