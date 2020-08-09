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
        links[curname]=[];
        const curJson= JSON.parse(fs.readFileSync("../process/results/"+current).toString());
        curJson.forEach(link => {
            links[curname].push(link);
        });        
   }



   res.status(200).json({
        files:files,
        links:links
   })
})

app.get("/",(req,res,next)=>{
    res.status(200).json({
        status:"OK",
        msg:"Welcome to level 1 spider api"
    })
})



app.listen("80");