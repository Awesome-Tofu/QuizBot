const { getUserScore } = require('../database');

module.exports = async function score(msg, number) {
    const { score, totalAskedQuestions } = await getUserScore(number);
    const replyData = `💯 Score :\n\n✅ एकूण बरोबर उत्तर:- ${score} \n❌ चुकीचे उत्तर :- ${totalAskedQuestions - score}\n📃 एकूण सोडवली प्रश्न :- ${totalAskedQuestions}`;
    await msg.reply(replyData);
}