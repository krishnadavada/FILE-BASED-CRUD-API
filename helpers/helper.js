function date(){
    let nDate = new Date().getDate();
    let nMonth = new Date().getMonth() + 1;
    let nYear = new Date().getFullYear();
    return `${nDate}/${nMonth}/${nYear}`
}

function createResponse({res,nstatusCode,odata,bisError=false,sisMessage=""}){
    if(bisError){
        res.writeHead(nstatusCode,{'content-type':'application/json'})
        return res.end(JSON.stringify({'error':bisError}))
    }
    else if(sisMessage){
        res.writeHead(nstatusCode,{'content-type':'application/json'})
        return res.end(JSON.stringify({'message':sisMessage}))
    }
    else if(odata){
        res.writeHead(nstatusCode,{'content-type':'application/json'})
        return res.end(JSON.stringify({'data':odata}))
    }
}

module.exports={date,createResponse}