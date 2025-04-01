const oStatus = {
  OK: 200,
  Created: 201,
  Deleted: 204,
  BadRequest: 400,
  NotFound: 404,
  InternalServerError: 500
}

const oMessage = {
  server_up : 'Server is up !',
  not_found: '## not found !',
  fetch:'Data fetched successfully !',
  name_exist:'Data already exist with same product name !',
  success:'Item ## successfully !',
  some_wrong:'Something went wrong !',
  internal_err:'Internal server error !'
}

//function for send msg and replce ## to actual value
function sendMsg(sMessageType,sReplaceWith){
  if(!oMessage[sMessageType])
  {
    return oMessage['some_wrong'];
  }
  return sReplaceWith ? oMessage[sMessageType].replace('##',sReplaceWith) : oMessage[sMessageType]
}


//function for create response
function createResponse( res, sResponseType, sMessageType='', sReplaceWith='',oData) {

  const nStatusCode=oStatus[sResponseType] || oStatus.InternalServerError
  let sIsMessage=sMessageType ? sendMsg(sMessageType,sReplaceWith) : oMessage[internal_err]

  if(oData)
  {
    return res.status(nStatusCode).json({message:sIsMessage,data:oData})
  }
  return res.status(nStatusCode).json({message:sIsMessage})
}

module.exports = { createResponse };
