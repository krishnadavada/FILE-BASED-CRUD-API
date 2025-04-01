const { param,body,validationResult }=require("express-validator");
const{status}=require("../utils/enums");

const aIdValidator=[
  param('iId','Id is required !').notEmpty(),
  param('iId','Inavlid Id !').isUUID()
]

const aDataValidator=[
  body('sName','Name is required !').notEmpty(),
  body('sName','The minimum Name length should be three characters.').isLength({min:3}),
  body('sName','Invalid data type of name !').isString(),

  body('nQuantity','Quantity is required !').notEmpty(),
  body('nQuantity','Quantity should be not 0 and positive number !').isInt({min:1}),
  body('nQuantity','Invalid data type of quantity !').isInt(),

  body('nPrice','Price is required !').notEmpty(),
  body('nPrice','Price should be not 0 and positive number !').isInt({min:1}),
  body('nPrice','Invalid data type of price !').isInt(),

  body('sStatus','Status is required !').notEmpty(),
  body('sStatus','Invalid data type of status !').isString(),
  body('sStatus','Invalis status !').isIn(Object.keys(status))
]

function validateReq(req,res,next){
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({massage : errors.array()});
  }
  next();
}

module.exports = { aIdValidator,aDataValidator,validateReq };
