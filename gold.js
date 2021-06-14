const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const goldSchema = new Schema({
    user: String,
    goldAmount: Number
}, { timestamps: true });

const Gold = mongoose.model("Gold", goldSchema);
module.exports = Gold;
