const request = require("request-promise");
const cheerio = require("cheerio");
const puppeteer = require("puppeteer")

request("https://patrickhlauke.github.io/recaptcha/", (error, response, html) => {
    if(!error && response.statusCode==200) {
        const $ = cheerio.load(html);

        const datarow= $("rc-imageselect-desc-no-canonical");
        const output= datarow.find("strong").text();
        $("strong").each((i, data) => {
            const item= $(data).text();
            const item1= $(data).text();
            const item2= $(data).text();

            console.log(item, item1, item2);
        })
    }

});

//recaptcha-checkbox goog-inline-block recaptcha-checkbox-unchecked rc-anchor-checkbox  