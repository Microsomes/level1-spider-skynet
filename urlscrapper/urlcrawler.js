const puppeteer = require('puppeteer');
const fs = require("fs");
const moment= require("moment");

try{
var url = process.argv[3].split("=")[1];
var name = process.argv[2].split("=")[1];
}catch(e){
  console.log("cant launch check argv variables")
}

if(url==undefined){
  console.log("undefined url");
  return;
}
if(name==undefined){
  console.log("undefined name");
  return;
}


(async () => {
  try{
  var currentDate= moment().format('MMMM Do YYYY, h:mm:ss a'); // August 8th 2020, 5:32:43 pm
  var unix= moment().unix();
  console.log(currentDate);
  console.log(unix);
  var collectionOfUrls = await scrapeUrls(url);
  var cleanedCollection = await cleanUpURLCollection(collectionOfUrls);
  if (!fs.existsSync(`results/${name}`)) {
    fs.mkdirSync(`results/${name}`);
  }
  var humanDate=""

  var completedData={
    name:name,
    url:url,
    version:1,
    date:moment().unix(),
    links:cleanedCollection
  }
  fs.writeFile(`results/${name}/urls_${unix}.json`, JSON.stringify(completedData, null, 2), (err) => { });
}catch(e){
  console.log("something went wrong ill write a log on "+name);

  console.log(e);
}
})()


//filters the list of urls to ensure no duplication
async function cleanUpURLCollection(collectionOfUrls) {
  return new Promise((resolve, reject) => {
    try {
      const unique = Array.from(new Set(collectionOfUrls));
      resolve(unique);
    } catch (e) {
      console.log(e);
      reject(e);
    }
  })
}

async function scrapeUrls(url) {
  return new Promise(async (resolve, reject) => {
    try{
    const browser = await puppeteer.launch({ headless: true });
    // const browser= await puppeteer.connect({
    //   browserWSEndpoint:"wss://chrome.browserless.io/",
    // })
    const page = await browser.newPage();
    await page.goto(url);
    await page.waitFor(3000);
    //await page.waitForNavigation();
    // await page.waitForNavigation({
    //   waitUntil: 'networkidle0',
    // });
    //set 1 second wait time
    var urlsr = await page.evaluate(() => {
      var urls = document.querySelectorAll("a");
      var toSend = [];
      //contains all urls
      urls.forEach(u => {
        toSend.push(u.href);
      })
      return toSend;
    })
    await browser.close();
    resolve(urlsr)
  }catch(e){
    reject(e);
  }
  })
}