import puppeteer from "puppeteer"
import https from "https"
import fs from "fs"


const validObjects = ['person', 'bicycle', 'car', 'motorcycle', 'airplane', 'bus', 'train', 'truck', 'boat', 'traffic light',
'fire hydrant', 'stop sign', 'parking meter', 'bench', 'bird', 'cat', 'dog', 'horse', 'sheep', 'cow',
'elephant', 'bear', 'zebra', 'giraffe', 'backpack', 'umbrella', 'handbag', 'tie', 'suitcase', 'frisbee',
'skis', 'snowboard', 'sports ball', 'kite', 'baseball bat', 'baseball glove', 'skateboard', 'surfboard',
'tennis racket', 'bottle', 'wine glass', 'cup', 'fork', 'knife', 'spoon', 'bowl', 'banana', 'apple',
'sandwich', 'orange', 'broccoli', 'carrot', 'hot dog', 'pizza', 'donut', 'cake', 'chair', 'couch',
'potted plant', 'bed', 'dining table', 'toilet', 'tv', 'laptop', 'mouse', 'remote', 'keyboard', 'cell phone',
'microwave', 'oven', 'toaster', 'sink', 'refrigerator', 'book', 'clock', 'vase', 'scissors', 'teddy bear',
'hair drier', 'toothbrush'];


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
    
    let imagesrc
    imagesrc = await challengeFrame.$eval('.rc-image-tile-wrapper > img', img => img.src);

    console.log(imagesrc)

    const file = fs.createWriteStream("./images/file.jpg");
    const request = https.get(imagesrc, function(response) {
        response.pipe(file);
    });

})();