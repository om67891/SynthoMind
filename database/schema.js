const mongoose = require('mongoose');

const userInfoSchema = new mongoose.Schema({
    name: String,
    gender: String,
    password: String,
    phone: String,
    email: String,
    userParentInfo: Array, // name, phone number, relation, email
    chatHistoryId: Array,
    levelOfHelthId: String,
    healthHistory: String,
});


const levelOfHelthSchema = new mongoose.Schema({
    levelName: String,
    Disorders:Array,
});


const chatHistorySchema = new mongoose.Schema({
    userEmail: String,
    userChat: Array, // {userRequest, modelResponse}
    detectLevel: String, // level ID
    levelHistory: String,
    levelWisePossiblity: Array, // {lelevID1: 70, levelID2:20, levelID3: 10}
    isLevleDetect: Boolean,
    solutionPromt: String,
    updatedAt: { 
        type: Date, 
        default: Date.now 
    }
});

const userInfo = mongoose.model('userInfo', userInfoSchema);

const levelOfHelth = mongoose.model('levelOfHelth', levelOfHelthSchema);

const chatHistory = mongoose.model('chatHistory', chatHistorySchema);
module.exports = {userInfo, levelOfHelth, chatHistory };


