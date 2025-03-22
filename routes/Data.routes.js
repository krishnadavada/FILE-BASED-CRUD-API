const {getAllData,getDataById,addData,updateData,deleteData}=require('../controllers/Data.controller')

function dataRoutes(req,res){

    let url=req.url.split('/')

    if(req.url==='/api/data' && req.method==='GET'){
        return getAllData(req,res)
    }

    else if(url[1]==='api' && url[2]==='data' && req.method==='GET'){
        return getDataById(req,res,url[3])
    }

    else if(req.url==='/api/data' && req.method==='POST'){
        return addData(req,res)
    }

    else if(url[1]==='api' && url[2]==='data' && req.method==='PUT'){
        return updateData(req,res,url[3])
    }

    else if(url[1]==='api' && url[2]==='data' && req.method==='DELETE'){
        return deleteData(req,res,url[3])
    }

}

module.exports=dataRoutes