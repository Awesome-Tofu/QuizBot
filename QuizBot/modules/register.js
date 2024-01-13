const { uploadNumber, uploadName, uploadDOB, uploadDistrict, uploadPayed } = require('../database');

let user = {};

module.exports = async function register(msg, number){
    if (!user.stage) {
        user = { stage: 'number' };
        await uploadNumber(number);
        user.stage = 'name';
        await msg.reply("*Hello, I am quiz Bot. I can help you play quizes and check your knowledge.*\nYou are not in our database. Let's get you registered. \nPlease enter your name:");
    } else if (user.stage === 'name') {
        user.name = msg.body;
        await uploadName(number, user.name);
        user.stage = 'dob';
        await msg.reply("Please enter your DOB (YYYY-MM-DD):");
    } else if (user.stage === 'dob') {
        if (!msg.body || isNaN(Date.parse(msg.body)) || !/^\d{4}-\d{2}-\d{2}$/.test(msg.body)) {
            await msg.reply("Invalid date format. Please enter your DOB in the format YYYY-MM-DD:");
        } else {
            user.dob = new Date(msg.body);
            await uploadDOB(number, user.dob);
            user.stage = 'district';
            await msg.reply("Please enter your district:");
        }
    } else if (user.stage === 'district') {
        user.district = msg.body;
        await uploadDistrict(number, user.district);
        await uploadPayed(number, false);
        await msg.reply("You have been registered. You can now go ahead and pay in next message.");
        return;
    }
}