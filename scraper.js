import puppeteer from "puppeteer";
import https from "https";
import fs from "fs";

let page;
let browser;

const validObjects = ['bicycle', 'car', 'motorcycle', 'bus', 'boat', 'traffic light','fire hydrant', 'a fire hydrant'];

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
    if (input !== "bus" && input !== "a fire hydrant") {
        input = input.slice(0, -1);
    };
    if ( validObjects.indexOf(input) > -1 ) {
        getImage(challengeFrame);
    } else {
        refresh(challengeFrame);
    };
};

async function getImage(challengeFrame) {   
    let imagesrc = await challengeFrame.$eval('.rc-image-tile-wrapper > img', img => img.src);

    const file = fs.createWriteStream("./images/file.jpg");
    const request = https.get(imagesrc, function(response) {
        response.pipe(file);
    });
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

start();