const mongoose = require("mongoose");
const Jam = require("./models/jam.js");
const client = require("./config.js");

mongoose.connect("mongodb://localhost/twitchBotData", { useUnifiedTopology: true, useNewUrlParser: true })

const updateJam = async (channel, user) => {
    const userData = await Jam.findOne({ userName: user.username });
    userData.jam += 1;
    client.say(channel, `You now have ${userData.jam} jam!`);
    const update = await Jam.updateOne({ userName: user.username }, {
        $set: {
            jam: userData.jam
        }
    });
}

const getJam = async(channel, user, command, text) => {
    if (command === "!jam"){
        const hasUser = await Jam.exists({ userName: user.username });
        if (!hasUser){
            Jam.create({userName: user.username, jam: 1});
            client.say(channel, `You now have 1 jam!`);
        } else {
            updateJam(channel, user);
        }
    }
}

module.exports = getJam;

// Jam.create(testJam);
// Jam.deleteMany({}).then(res => console.log(res));
