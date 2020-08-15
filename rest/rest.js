const express= require("express");
const fs= require("fs");
var cors = require('cors')

const app= express();

app.use(cors())

app.get("/results",(req,res,next)=>{
   var files= fs.readdirSync("../process/results/");

   var links={}

   for(var i=0;i<files.length;i++){
        const current= files[i];
        const curname= current.split(".json")[0];
        links[curname]={};
        links[curname]['links']=[];
        var totalLinks=0;
        const curJson= JSON.parse(fs.readFileSync("../process/results/"+current).toString());
        curJson.forEach(link => {
            totalLinks++;
            links[curname]['links'].push(link);
        });  
        links[curname]['total']=totalLinks;      
   }



   res.status(200).json({
        files:files,
        links:links
   })
})

app.get("/",async (req,res,next)=>{
    res.status(200).json({
        status:"OK",
        msg:"Welcome to level 1 spider api",
        active:"Currently we are only scraping 3 websites to test the service but scraper1 will soon be able to handle 100s of links",
    })
})



app.listen("80");