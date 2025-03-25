const {createResponse}=require('../helpers/helper')
const { validate: uuidValidate  } = require('uuid')

function validateId(nid){
        return uuidValidate(nid);
}

function validateData(onewData){
    if(!onewData.sname || !onewData.nquantity || !onewData.nprice || !onewData.sstatus){
        return { bisValid:false, smessage:'Invalid data!'}
    }
    else if(typeof(onewData.sname)!=='string'){
        return { bisValid:false, smessage:'Invalid data type of name!'}
    }
    else if(typeof(onewData.nquantity)!=='number'){
        return { bisValid:false, smessage:'Invalid data type of quantity!'}
    }
    else if(typeof(onewData.nprice)!=='number'){
        return { bisValid:false, smessage:'Invalid data type of price!'}
    }
    else if(typeof(onewData.sstatus)!=='string'){
        return { bisValid:false, smessage:'Invalid data type of status!'}
    }
    else if(onewData.nquantity<0 || onewData.nprice<0){
        return { bisValid:false, smessage:'Invalid quantity or price!'}
    }
    return {bisValid:true};
}

module.exports={validateId,validateData}