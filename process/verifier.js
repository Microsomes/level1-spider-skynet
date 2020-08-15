//ensures that we only scrape links with the potential to get the best results
const fs= require("fs");
const readline = require('readline');
const { json } = require("body-parser");

function askQuestion(query) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    return new Promise(resolve => rl.question(query, ans => {
        rl.close();
        resolve(ans);
    }))
}


(async ()=>{
    var dir=fs.readdirSync("results");
    if(dir.length==0){
        console.log("nothing to process")
    }else{
    
        for(var i=0;i<dir.length;i++){
            const current= dir[i].split(".")[0];
           var f= JSON.parse(fs.readFileSync("results/"+current+".json"));

           var allVerified=[];

           var didContinue=false;
    
    
           for(var ii=0;ii<f.length;ii++){
               const link= f[ii];
               console.log("----------------------------")
               console.log(link);
               console.log("----------------------------")
               const ans = await askQuestion("Press 1 to verify or any key to ignore or 0 to skip this entire one");
               if(ans==0){
                   console.log("skip")
                   didContinue=true;
                   break;
               }
               if(ans==1){
                   console.log("verified");
                   allVerified.push(link);
               }
    
           }

           if(didContinue==false){
           fs.writeFile("verifiedDataScrapeLinks/"+current+"_verified.json",JSON.stringify(allVerified),()=>{});
           //write all verified here
           }else{
               if(allVerified.length>=1){
                   //still save it even if skipped
                   fs.writeFile("verifiedDataScrapeLinks/"+current+"_verified.json",JSON.stringify(allVerified),()=>{});
               }
           }

           
            
        }
    
    }    
})()
