const { uploadNumber, uploadName, uploadDOB, uploadDistrict, uploadPayed } = require('../database');

let users = {};

module.exports = async function register(msg, number){
    if (!users[number]) {
        users[number] = { stage: 'number' };
        await uploadNumber(number);
        users[number].stage = 'name';
        await msg.reply("*Hello, I am quiz Bot. I can help you play quizes and check your knowledge.*\nYou are not in our database. Let's get you registered. \nPlease enter your name:");
    } else if (users[number].stage === 'name') {
        users[number].name = msg.body;
        await uploadName(number, users[number].name);
        users[number].stage = 'dob';
        await msg.reply("Please enter your DOB (YYYY-MM-DD):");
    } else if (users[number].stage === 'dob') {
        if (!msg.body || isNaN(Date.parse(msg.body)) || !/^\d{4}-\d{2}-\d{2}$/.test(msg.body)) {
            await msg.reply("Invalid date format. Please enter your DOB in the format YYYY-MM-DD:");
        } else {
            users[number].dob = new Date(msg.body);
            await uploadDOB(number, users[number].dob);
            users[number].stage = 'district';
            await msg.reply("Please enter your district:");
        }
    } else if (users[number].stage === 'district') {
        users[number].district = msg.body;
        await uploadDistrict(number, users[number].district);
        await uploadPayed(number, false);
        await msg.reply("You have been registered. You can now go ahead and pay here\nhttps://pay-site.vercel.app/" + number);
        delete users[number]; 
        return;
    }
}