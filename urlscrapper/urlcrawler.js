const puppeteer = require('puppeteer');
const fs = require("fs");
const moment= require("moment");

var browser=null;
//global browser

var lastTab=null;

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

  //we will check if theirs a verified list for this name, IF SO USE IT as it is better then
  //simply scraping 1 web link
  if(fs.existsSync("../process/verifiedDataScrapeLinks/"+name+"_verified.json")){
    console.log("cancel scraping normal mode and use the verified list instead");


    var linksToScrape= JSON.parse(fs.readFileSync("../process/verifiedDataScrapeLinks/"+name+"_verified.json"));


    var result=[]

    var completedData={
      name:name,
      url:url,
      version:1,
      date:moment().unix(),
      links:[]  
    }

    for(var linki=0;linki< linksToScrape.length;linki++){
      const curLink= linksToScrape[linki];
      var collectionOfUrls = await scrapeUrls(curLink);
      var cleanedCollection = await cleanUpURLCollection(collectionOfUrls);
      console.log("scrappppppppppppppppppped------------------"+curLink)
      result.push(...cleanedCollection);
    }

    completedData.links=result;

    if (!fs.existsSync(`results/${name}`)) {
      fs.mkdirSync(`results/${name}`);
    }

    fs.writeFileSync(`results/${name}/urls_${unix}.json`, JSON.stringify(completedData, null, 2), (err) => {

      console.log(err);
     });



  }else{

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




  var totalLinks=cleanedCollection.length;






  // for(var i=0;i<totalLinks;i++){
  //   console.log("scrapping innner-----------------------",name);
  //   const curLink= cleanedCollection[i];
  //   var lv2collectionOfUrls = await scrapeUrls(curLink);
  //   console.log(lv2collectionOfUrls);
  //   completedData.links.push(...lv2collectionOfUrls);
  // }

  // completedData.links= Array.from(new Set(completedData.links));

  await browser.close();
  console.log("browser closed");

 
   


    
   fs.writeFile(`results/${name}/urls_${unix}.json`, JSON.stringify(completedData, null, 2), (err) => { });
}

}catch(e){
  console.log("something went wrong ill write a log on "+name);

  console.log(e);

}finally{
  if(browser==null){

  }else{
  await browser.close();
  }
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
      if(browser==null){
        console.log("no");
     browser = await puppeteer.launch({ args: ['--no-sandbox'],headless: false,userDataDir:"dir" });
    //  browser= await puppeteer.connect({
    //   browserWSEndpoint:"---",
    // })
      }else{
        //browser = await puppeteer.launch({ args: ['--no-sandbox'],headless: false });
        //lets reopen the browser because its null
        // browser= await puppeteer.connect({
        //   browserWSEndpoint:"----",
        // })
      }
    
      if(lastTab==null){
        lastTab= await browser.newPage();
      }else{
       await lastTab.close();
       lastTab= await browser.newPage();

      }


    const page = lastTab
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
     resolve(urlsr)
  }catch(e){
    reject(e);
  }
  })
}