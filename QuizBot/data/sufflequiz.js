const fs = require('fs');

async function shuffleQuiz() {
    const quizData = JSON.parse(fs.readFileSync(__dirname+'/quiz.json', 'utf8'));
    
    for (let i = quizData.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [quizData[i], quizData[j]] = [quizData[j], quizData[i]];
    }
    
    return quizData;
}

module.exports = shuffleQuiz;