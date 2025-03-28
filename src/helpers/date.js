function date(){
    let nDate = new Date().getDate();
    let nMonth = new Date().getMonth() + 1;
    let nYear = new Date().getFullYear();
    return `${nDate}/${nMonth}/${nYear}`
}

function createResponse({res,nstatusCode,odata,bisError=false,sisMessage=""}){
    if(bisError){
        return res.status(nstatusCode).json({'error':bisError})
    }
    else if(sisMessage){
        return res.status(nstatusCode).json({'message':sisMessage})
    }
    else if(odata){
        return res.status(nstatusCode).json({'data':odata})
    }
}

module.exports={date}