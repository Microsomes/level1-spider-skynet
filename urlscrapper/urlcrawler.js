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
  fs.writeFile(`results/${name}/urls_${unix}.json`, JSON.stringify(cleanedCollection, null, 2), (err) => { });
}catch(e){
  console.log("something went wrong ill write a log on "+name);
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
    const page = await browser.newPage();
    await page.goto(url);
    //await page.waitFor(1000);
    await page.waitForNavigation();
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