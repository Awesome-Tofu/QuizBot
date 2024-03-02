const shuffleQuiz = require('../data/sufflequiz');
const { updateUserScore } = require('../database');

let quizData;
(async () => {
    quizData = await shuffleQuiz();
})();

async function quiz(user, msg) {
    const number = msg.from.replace('@c.us', '');

    if (!user.currentQuestionIndex) {
        // Start the quiz
        user.quizstarted = true;
        user.currentQuestionIndex = 0;
        user.correctAnswers = 0;
        user.wrongAnswers = [];
        user.askedQuestions = 0;
    }

    const questionData = quizData[user.currentQuestionIndex];

    if (!user.question) {
        // Send the question
        user.question = questionData.q;
        user.correctOption = questionData.correct;
    } else {
        // Check the answer
        const answer = msg.body.toLowerCase();

        if (answer !== 'a' && answer !== 'b' && answer !== 'c' && answer !== 'd' && answer !== 'stop') {
            await msg.reply("Only a, b, c, and d are valid answers. Please give the valid answer");
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

        if (answer == "stop") {
            let report = `The quiz is over. You answered correctly to ${user.correctAnswers} out of ${user.askedQuestions} questions.`;
            if (user.wrongAnswers.length > 0) {
                report += '\n\nHere are the questions you answered incorrectly along with the correct answers:\n';
                report += user.wrongAnswers.map((item, index) => `${index + 1}. Question: ${item.question}\n   Correct answer: ${item.correctAnswer}`).join('\n');
            }
            await msg.reply(report);
            // Upload the score to the database
            await updateUserScore(number, user.correctAnswers, user.askedQuestions);
            delete user.correctAnswers;
            delete user.currentQuestionIndex;
            delete user.question;
            delete user.askedQuestions;
            delete user.wrongAnswers;
            user.quizstarted = false;
            return;
        }

        // Move to the next question or end the quiz
        user.currentQuestionIndex++;
        user.askedQuestions++;
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
            await updateUserScore(number, user.correctAnswers, quizData.length);
            // Reset the quiz
            delete user.correctAnswers;
            delete user.currentQuestionIndex;
            delete user.question;
            delete user.askedQuestions;
            delete user.wrongAnswers;
            user.quizstarted = false;
            return;
        }
    }

    // Get the next question data
    const nextQuestionData = quizData[user.currentQuestionIndex];
    // Send the next question
    user.question = nextQuestionData.q;
    user.correctOption = nextQuestionData.correct;
    await msg.reply(`${user.question}\n\na. ${nextQuestionData.options.a}\nb. ${nextQuestionData.options.b}\nc. ${nextQuestionData.options.c}\nd. ${nextQuestionData.options.d}`);
}

module.exports = quiz;