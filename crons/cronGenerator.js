//will generate the start json

const fs= require("fs");
const axios= require("axios");

var template={
    "apps": [
     
    ]
  };

(async ()=>{
   var level1= await axios.get("http://api.maeplet.com/scrapper/level1");
   var result= level1.data.result;

   result.forEach(item=>{
       template.apps.push(
        {
            "name": "Scrape "+item.name+"-"+item.location,
            "script": "urlcrawler.js",
            "args": [
              "--name="+item.name,
              "--url="+item.url
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
       )
   })

   //generate the .json cron

   fs.writeFile("cron.json",JSON.stringify(template,null,2),()=>{});
   

})();




