const { MongoClient } = require('mongodb');
require('dotenv').config();

const client = new MongoClient(process.env.MONGODB_URI);

client.connect(err => {
    if (err) throw err;
    console.log("Connected to MongoDB server");
});

const db = client.db('users');
const User = db.collection('data');

async function uploadNumber(number) {
    await User.findOneAndUpdate({ number }, { $set: { number } }, { upsert: true });
}

async function uploadName(number, name) {
    await User.findOneAndUpdate({ number }, { $set: { name } });
}

async function uploadDOB(number, DOB) {
    await User.findOneAndUpdate({ number }, { $set: { DOB } });
}

async function uploadDistrict(number, district) {
    await User.findOneAndUpdate({ number }, { $set: { district } });
}

async function uploadPayed(number, payed) {
    await User.findOneAndUpdate({ number }, { $set: { payed } });
}

async function isUserPaid(msg) {
    const number = msg.from.replace('@c.us', '');
    const user = await User.findOne({ number });
    return user ? user.payed === true : false;
}

async function isUserInDatabase(msg) {
    const number = msg.from.replace('@c.us', '');
    const user = await User.findOne({ number });

    if (user && user.name && user.DOB && user.district) {
        return true;
    } else {
        return false;
    }
}

async function updateUserScore(number, score, totalAskedQuestions) {
    await User.updateOne(
        { number },
        {
            $inc: {
                score: score,
                totalAskedQuestions: totalAskedQuestions
            }
        },
        { upsert: true }
    );
}


async function getUserScore(number) {
    const user = await User.findOne({ number });

    if (user) {
        // If user is found, return the user's score and totalAskedQuestions
        return { score: user.score || 0, totalAskedQuestions: user.totalAskedQuestions || 0 };
    } else {
        // If the user is not found, return 0 for score and totalAskedQuestions
        return { score: 0, totalAskedQuestions: 0 };
    }
}

module.exports = { uploadNumber, uploadName, uploadDOB, uploadDistrict, uploadPayed, isUserPaid, isUserInDatabase, updateUserScore, getUserScore};