const {defaultFileServe,staticFileServe}=require('../controllers/Public.controller')

function publicRoutes(req,res){
    if(req.url==='/public' && req.method==='GET'){
        return defaultFileServe(req,res)
    }

    else if(req.url.split('/')[1]==='public' && req.method==='GET'){
        return staticFileServe(req,res)
    }
}

module.exports=publicRoutes