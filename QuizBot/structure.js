const { isUserPaid, isUserInDatabase } = require('./database.js');
const register = require('./modules/register.js');
const quiz = require('./modules/quiz.js');
const score = require('./modules/score.js');

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
    
    if (!user.quizstarted && isPaid && ((quotedMsg && quotedMsg.body === startMsg && msg.body === "1") || msg.body == '1')) {
        await msg.reply("Social Affairs Quiz Started");
        await msg.reply("no questions available")
    } else if (!user.quizstarted && isPaid && ((quotedMsg && quotedMsg.body === startMsg && msg.body === "2") || msg.body == '2')) {
        await msg.reply("Quiz Started\nChoose your answer by sending a, b, c or d   \nType `stop` to end the quiz at any time.")
        await quiz(user, msg);
        // isQuiz = false;
    } else if (user.question) {
        // Handle the user's answer to the quiz question
        await quiz(user, msg);
    } else if (!user.quizstarted && isPaid && msg.body.toLowerCase() === "score") {
        await score(msg, number);
    }else if (!user.quizstarted && !isInDatabase) {
        await register(msg, number);
    } else if (!user.quizstarted && isInDatabase && !isPaid) {
        await msg.reply("Thanks for registering.\nYou can pay the amount of Rs.X here:\n" + `https://pay-site.vercel.app/${number}`);
        return;
    } else {
        await msg.reply(startMsg);
    }
}