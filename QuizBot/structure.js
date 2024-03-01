const { isUserPaid, isUserInDatabase } = require('./database.js');
const register = require('./modules/register.js');
const quiz = require('./modules/quiz.js');

const users = new Map();

module.exports = async function structure(client, msg) {
    const quotedMsg = await msg.getQuotedMessage();
    const startMsg = "Hello, I am quiz Bot. I can help you play quizes and check your knowledge. Please *reply this message* with follwing *number* you want to play\n\n1️⃣Social Affairs\n2️⃣Quiz"

    const number = msg.from.replace('@c.us', '');
    const isInDatabase = await isUserInDatabase(msg);
    const isPaid = await isUserPaid(msg);

    let user = users.get(number);
    if (!user) {
        user = {};
        users.set(number, user);
    }

    if (isPaid && ((quotedMsg && quotedMsg.body === startMsg && msg.body === "1") || msg.body == '1')) {
        await msg.reply("Social Affairs Quiz Started");
        await msg.reply("no questions available")
    } else if (isPaid && ((quotedMsg && quotedMsg.body === startMsg && msg.body === "2") || msg.body == '2')) {
        await msg.reply("Quiz Started")
        await quiz(user, msg);
        // isQuiz = false;
    } else if (user.question) {
        // Handle the user's answer to the quiz question
        await quiz(user, msg);
    } else if (!isInDatabase) {
        await register(msg, number);
    } else if (isInDatabase && !isPaid) {
        await msg.reply("Thanks for registering.\nYou can pay the amount of Rs.X here:\n" + `https://pay-site.vercel.app/${number}`);
        return;
    } else {
        await msg.reply(startMsg);
    }
}