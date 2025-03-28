function createResponse({res,nStatusCode,oData,bIsError=false,sIsMessage=""}){
    if(bIsError){
        return res.status(nStatusCode).json({'error':bIsError})
    }
    else if(sIsMessage){
        return res.status(nStatusCode).json({'message':sIsMessage})
    }
    else if(oData){
        return res.status(nStatusCode).json({'data':oData})
    }
}

module.exports={createResponse}