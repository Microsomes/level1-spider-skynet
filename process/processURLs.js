const fs = require("fs");
const moment= require("moment");



(async () => {

    var result = await grabAllResultsDir();


    if(result.length==0){
        console.log("nothing to process");
        return;
    }

    for (var i = 0; i < result.length; i++) {
        const current = result[i];

       var allJSONResults= await listJsonByResultID(current);

       if(allJSONResults.length==0){
           console.log("nothing to process");
       }else{
       var allCurrentLinksToProcess=[]
       for(var ii=0;ii<allJSONResults.length;ii++){
           const currentJsonFile= allJSONResults[ii];
           const jsonRead= fs.readFileSync("../urlscrapper/results/"+current+"/"+currentJsonFile);
           allCurrentLinksToProcess.push(...JSON.parse(jsonRead)['links'])
           fs.unlinkSync("../urlscrapper/results/"+current+"/"+currentJsonFile);
       }
       //lets check for dublicates
       allCurrentLinksToProcess= Array.from(new Set(allCurrentLinksToProcess));
       fs.writeFileSync("results/"+current+".json",JSON.stringify(allCurrentLinksToProcess,null,2),()=>{});
    }

    }

})();

function listJsonByResultID(id) {
    return new Promise((resolve, reject) => {
        try {
            var allResults = fs.readdirSync("../urlscrapper/results/"+id, (err) => {
                reject(err);
            });
            resolve(allResults)
        } catch (e) {
            reject(e);
        }
    })
}

function grabAllResultsDir() {
    return new Promise((resolve, reject) => {
        try {
            var allResults = fs.readdirSync("../urlscrapper/results", (err) => {
                reject(err);
            });
            resolve(allResults);
        } catch (e) {
            reject(e);
        }
    })
}


