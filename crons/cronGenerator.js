//will generate the start json

const fs= require("fs");
const axios= require("axios");

var template={
    "apps": [
      {
        "name": "Scrape Liveuamap",
        "script": "urlcrawler.js",
        "args": [
          "--name=liveuamap",
          "--url=https://liveuamap.com/ "
        ],
        "node_args": "--harmony",
        "merge_logs": true,
        "instances": 1,
        "exec_mode": "fork",
        "cron_restart": "*/5 * * * *",
        "watch": false,
        "autorestart": false,
        "cwd": "../urlscrapper/",
        "env": {
          "NODE_ENV": "production"
        }
      }
    ]
  };

(async ()=>{
   var level1= await axios.get("http://api.maeplet.com/scrapper/level1");
   var result= level1.data.result;

   console.log(result)

})();




