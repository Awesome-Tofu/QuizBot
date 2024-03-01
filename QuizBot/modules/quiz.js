const fs = require('fs');
const path = require('path');
const jsonPath = path.join(__dirname, '..', 'data', 'quiz.json');

const quizData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

async function quiz(user, msg) {
    if (!user.currentQuestionIndex) {
        // Start the quiz
        user.currentQuestionIndex = 0;
        user.correctAnswers = 0;
        user.wrongAnswers = [];
    }

    const questionData = quizData[user.currentQuestionIndex];

    if (!user.question) {
        // Send the question
        user.question = questionData.q;
        user.correctOption = questionData.correct;
    } else {
        // Check the answer
        const answer = msg.body.toLowerCase();
        if (answer !== 'a' && answer !== 'b' && answer !== 'c' && answer !== 'd') {
            await msg.reply("Only a, b, c, and d are valid answers.");
            return;
        }
        if (answer === user.correctOption) {
            user.correctAnswers++;
        } else {
            user.wrongAnswers.push({
                question: user.question,
                correctAnswer: user.correctOption
            });
        }
        // Move to the next question or end the quiz
        user.currentQuestionIndex++;
        if (user.currentQuestionIndex < quizData.length) {
            // Clear the question and correct option
            delete user.question;
            delete user.correctOption;
        } else {
            let report = `The quiz is over. You answered correctly to ${user.correctAnswers} out of ${quizData.length} questions.`;
            if (user.wrongAnswers.length > 0) {
                report += '\n\nHere are the questions you answered incorrectly along with the correct answers:\n';
                report += user.wrongAnswers.map((item, index) => `${index + 1}. Question: ${item.question}\n   Correct answer: ${item.correctAnswer}`).join('\n');
            }
            await msg.reply(report);
            // Reset the quiz            delete user.currentQuestionIndex;
            delete user.correctAnswers;
            delete user.currentQuestionIndex;
            delete user.question;
            delete user.wrongAnswers;
            return;
        }
    }

    // Get the next question data
    const nextQuestionData = quizData[user.currentQuestionIndex];
    // Send the next question
    user.question = nextQuestionData.q;
    user.correctOption = nextQuestionData.correct;
    await msg.reply(`${user.question}\na. ${nextQuestionData.options.a}\nb. ${nextQuestionData.options.b}\nc. ${nextQuestionData.options.c}\nd. ${nextQuestionData.options.d}`);
}

module.exports = quiz;