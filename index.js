const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const puppeteer = require('puppeteer');
require("dotenv").config();

//modules import
const structure = require('./QuizBot/structure')

const puppeteerExecutablePath =
    process.env.NODE_ENV === 'production'
        ? process.env.PUPPETEER_EXECUTABLE_PATH
        : puppeteer.executablePath();


const client = new Client({
    // ffmpegPath: '/app/vendor/ffmpeg',
    authStrategy: new LocalAuth({ clientId: "quizbot" }),
    puppeteer: {
        args: ['--no-sandbox',
            '--disable-setuid-sandbox'
        ],
        executablePath: puppeteerExecutablePath,
        headless: 'new',
    }
});

client.initialize();
console.log("Initializing...");

client.on('qr', async (qr) => {
    console.log('QR RECEIVED', qr);
    qrcode.generate(qr, { small: true });
});

client.on('authenticated', async (session) => {
    console.log('WHATSAPP WEB => Authenticated');
});

client.on('ready', async () => {
    console.log('quiz bot started successfully!');
});

client.on('message', async msg => {
    structure(client, msg);
});