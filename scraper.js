const request = require("request-promise");
const cheerio = require("cheerio");
const puppeteer = require("puppeteer");

const validObjects = {};


(async () => {
    const browser = await puppeteer.launch({headless:false});
    const page = await browser.newPage();

    await page.goto('https://patrickhlauke.github.io/recaptcha/');

    //Initiate reCAPTIA
    const initCaptia = await page.$("iframe[title='reCAPTCHA']")
    await initCaptia.click()

    let challengeFrame 

    for (const frame of page.mainFrame().childFrames()){
        
        if (frame.url().includes('https://www.google.com/recaptcha/api2/bframe?')){
            console.log('found the iframe')
            challengeFrame = frame 
           
        }
    }

    await challengeFrame.waitForSelector('strong')
    let element = await challengeFrame.$('strong')
    let objectType = await challengeFrame.evaluate(el => el.textContent, element)

    console.log(objectType)
    let size
    let imagesrc

    if (await challengeFrame.$('rc-image-title-33') !== null) {
        imagesrc = await challengeFrame.$$eval('.rc-image-title-33[src]');
        size = 300
    } else {
        imagesrc = await challengeFrame.$$eval('.rc-image-title-44[src]');
        size = 450
    }
   
    console.log(imagesrc)
    


})();

  