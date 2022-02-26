import puppeteer from "puppeteer";
import https from "https";
import fs from "fs";
import { randomInt } from "crypto";

let page;
let browser;

const validObjects = ['bicycle', 'car', 'motorcycle', 'bus', 'boat', 'traffic light','fire hydrant'];

let input = null;
let array;

function delay(time) {
    return new Promise(function(resolve) { 
        setTimeout(resolve, time)
    });
};

async function start() {
    browser = await puppeteer.launch({headless:false});
    page = await browser.newPage();

    await page.goto('https://patrickhlauke.github.io/recaptcha/');

    const initCaptia = await page.$("iframe[title='reCAPTCHA']");
    await initCaptia.click();

    main();
};


async function refresh(challengeFrame) {
    await delay(500);
    const reloadButton = await challengeFrame.$("button[id='recaptcha-reload-button']");
    await reloadButton.click();
    await delay(500);
    main();
};

async function validObject(input, challengeFrame) {
    if (input !== "bus") {
        input = input.slice(0, -1);
    };
    if ( validObjects.indexOf(input) > -1 ) {
        getImage(challengeFrame, input);
    } else {
        refresh(challengeFrame);
    };
};

async function getImage(challengeFrame, type) {   
    let imagesrc = await challengeFrame.$eval('.rc-image-tile-wrapper > img', img => img.src);

    const fileName = "./images/" + String(type) + ".jpg"
    const fileWrite = fs.createWriteStream(fileName);
    const request = https.get(imagesrc, function(response) {
        response.pipe(fileWrite);
    });

    getResponse();
    
};

async function main() {

    let challengeFrame;

    for (const frame of page.mainFrame().childFrames()) {
        
        if (frame.url().includes('https://www.google.com/recaptcha/api2/bframe?')) {
            challengeFrame = frame;
            
        };
    };

    await challengeFrame.waitForSelector('strong');
    let element = await challengeFrame.$('strong');
    let objectType = await challengeFrame.evaluate(el => el.textContent, element);

    validObject(objectType, challengeFrame);
};

//Solver Functions

async function solve4x4(array) {
    let challengeFrame;

    for (const frame of page.mainFrame().childFrames()) {
        
        if (frame.url().includes('https://www.google.com/recaptcha/api2/bframe?')) {
            challengeFrame = frame;
        };
    };

    let table = await challengeFrame.waitForSelector('tbody');
    let cel;

    for (var i = 0; i <  16; i++) {
        cel = await challengeFrame.$("td[tabindex='" + String(i + 4) + "']");
        if (array[i] == 1) {
            await cel.click();
            await delay(randomInt(300,700))
        };
    };
    if (input !== "0000000000000000") main();
    if (input == "0000000000000000") {
        let verify = await challengeFrame.$("button[id='recaptcha-verify-button']");
        await verify.click();
    }
};


async function solve3x3(array) {
    let challengeFrame;

    for (const frame of page.mainFrame().childFrames()) {
        
        if (frame.url().includes('https://www.google.com/recaptcha/api2/bframe?')) {
            challengeFrame = frame;
        };
    };

    let table = await challengeFrame.waitForSelector('tbody');
    let cel;

    for (var i = 0; i < 9; i++) {
        cel = await challengeFrame.$("td[tabindex='" + String(i + 4) + "']");
        if (array[i] == 1) {
            await cel.click();
            await delay(randomInt(300,700))
        };
    };
    if (input !== "000000000") main();
    if (input == "000000000") {
        let verify = await challengeFrame.$("button[id='recaptcha-verify-button']");
        await verify.click();
    }
};

function solve() {
    if (input.length == 9) {
        solve3x3(array);
    } else {
        solve4x4(array);
    };
};

function getResponse() {
    fs.readFile('answer.txt', "utf8", function(err, data) {
        if (data == null) getResponse;
        if (data !== null) {
            input = data;
            array = input.slice('');
            solve();
        }
    });
    
    const form = new FormData();
    const stream = fs.createReadStream(PATH_TO_FILE);

    form.append('data', data);

    // In Node.js environment you need to set boundary in the header field 'Content-Type' by calling method `getHeaders`
    const formHeaders = form.getHeaders();

    axios.post('https://zeyadmansour.com/hsiohackathon', form, {
      headers: {
        ...formHeaders,
      },
    })
    .then(response => response)
    .catch(error => error)
};

start();
