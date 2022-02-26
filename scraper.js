const request = require("request-promise");
const cheerio = require("cheerio");
const puppeteer = require("puppeteer");

const cache = {};

(async () => {
    const browser = await puppeteer.launch({headless:false});
    const page = await browser.newPage();

    await page.goto('https://patrickhlauke.github.io/recaptcha/');

    //Initiate reCAPTIA
    await page.click("iframe[title='reCAPTCHA']")

    

  })();

  