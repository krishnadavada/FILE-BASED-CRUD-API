const {defaultFileServe,staticFileServe}=require('../controllers/Public.controller')

function publicRoutes(req,res){
    try{
        switch(true){
            case req.url==='/public' && req.method==='GET' :
                return defaultFileServe(req,res)
            break
        
            case req.url.split('/')[1]==='public' && req.method==='GET' :
                return staticFileServe(req,res)
            break
        }
    }
    catch(err){
        console.log(err.message)
        return createResponse({ res, nstatusCode: 500, bisError: err.message });
    }
}

module.exports=publicRoutes