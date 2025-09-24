const mongoose = require('mongoose');

const userInfoSchema = new mongoose.Schema({
    name: String,
    gender: String,
    password: String,
    phone: String,
    email: String,
    userParentInfo: [{
        name: String,
        phone: String,
        relation: String,
        email: String,
        lastUpdated: {
            type: Date,
            default: Date.now
        }
    }],
    chatHistoryId: Array,
    levelOfHelthId: String,
    healthHistory: String,
    otp: String,
    otpExpiry: Date,
    isVerified: {
        type: Boolean,
        default: false
    },
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

const reportSchema = new mongoose.Schema({
    chatId: Array,

})

const userInfo = mongoose.model('userInfo', userInfoSchema);

const levelOfHelth = mongoose.model('levelOfHelth', levelOfHelthSchema);

const chatHistory = mongoose.model('chatHistory', chatHistorySchema);

module.exports = {userInfo, levelOfHelth, chatHistory };


