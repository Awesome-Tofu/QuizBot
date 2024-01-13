const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const puppeteer = require('puppeteer');
require("dotenv").config();
const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const qrimage = require('qr-image');
//modules import
const structure = require('./QuizBot/structure')
const port = process.env.PORT || 8000;

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

let qrText;
let isClientReady = false;

app.get('/', (req, res) => {
    if (qrText && !isClientReady) {
        // If QR code is available and client is not ready
        fs.readFile('index.html', 'utf8', (err, data) => {
            const qr_code = qrimage.imageSync(qrText, { type: 'svg' });
            const modifiedHTML = data.replace('<div class="loading-animation"></div>', qr_code).replace('<!-- pfp -->', '<img class="github-pfp" src="pfp.gif" alt="GitHub PFP">').replace('Please wait Qr code is being generated', 'Scan the QR code using your WhatsApp app');
            res.send(modifiedHTML);
        });
    } else if (isClientReady) {
        // If client is ready
        fs.readFile('index.html', 'utf8', (err, data) => {
            const modifiedHTML = data.replace('<div class="loading-animation"></div>', '<div class="scanning-complete">Scanning complete ✅</div>').replace('Please wait Qr code is being generated', 'Scan completed!').replace('setInterval(checkForQRCode, 5000);', 'setInterval(checkForQRCode, 1000);');
            res.send(modifiedHTML);
        });
    } else {
        // If neither QR code nor client is ready
        fs.readFile('index.html', 'utf8', (err, data) => {
            res.send(data);
        });
    }
});

client.initialize();
console.log("Initializing...");

client.on('qr', async (text) => {
    qrText = text; // Store the QR code text
    console.log('QR RECEIVED', qrText);
    qrcode.generate(qrText, { small: true });
    console.log('Visit the server URL to scan the code');
});

client.on('authenticated', async (session) => {
    console.log('WHATSAPP WEB => Authenticated');
});

client.on('ready', async () => {
    console.log('quiz bot started successfully!');
    isClientReady = true;
});

client.on('message', async msg => {
    structure(client, msg);
});


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});