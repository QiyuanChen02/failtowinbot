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
			let asciiCode = text.codePointAt(i);
			console.log("ascii:", asciiCode);

			let codeForFont = 0x1D41A;
			let letterNumber = parseInt(codeForFont, 10) + (asciiCode - 97);
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

	// if (user.mod){
	// 	client.unmod(channel, "failtowinpro").catch(error => console.log(error));
	// } else {
	// 	client.mod(channel, "failtowinpro").catch(error => console.log(error));
	// }
	
	if(message.substring(0, 10).toLowerCase() === "!nomention"){
		client.say(channel, convertText(message.substring(11, message.length)))
	}

});

