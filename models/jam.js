const mongoose = require("mongoose");

const jamSchema = new mongoose.Schema({
    userName: {type: String, required: true},
    jam: {type: Number, required: true}
}, { collection: "jams", timestamps: true });

const Jam = mongoose.model("jam", jamSchema);
module.exports = Jam;