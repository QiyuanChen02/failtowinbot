const fetch = require("node-fetch");

let questionList = [];
let triviaStarted = false;
fetch("https://jsonkeeper.com/b/4KEW")
.then(res => res.json())
.then(data => {
    console.log("Question list received");
	data.questions.forEach(question => {
		questionList.push(question);
	});
})
.catch(err => console.log(err));

// const triviaSettings = {
// 	channel: "failtowinbot",
// 	timer: 30

// }
module.exports = questionList;