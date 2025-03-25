const {getAllData,getDataById,addData,updateData,deleteData}=require('../controllers/Data.controller')

function dataRoutes(req,res){

    try{
        let surl=req.url.split('/')

        switch(true){
    
            case req.url==='/api/data' && req.method==='GET' :
                return getAllData(req,res)
            break
            
        
            case surl[1]==='api' && surl[2]==='data' && req.method==='GET' :
                return getDataById(req,res,surl[3])
            break
            
        
            case req.url==='/api/data' && req.method==='POST' :
                return addData(req,res)
            break
            
        
            case surl[1]==='api' && surl[2]==='data' && req.method==='PUT' :
                return updateData(req,res,surl[3])
            break
            
        
            case surl[1]==='api' && surl[2]==='data' && req.method==='DELETE' :
                return deleteData(req,res,surl[3])
            break

            default :
                res.status(404).json({message:'Route Not Found'})
        }
    }
    catch(err){
        console.log(err.message)
        return createResponse({ res, nstatusCode: 500, bisError: err.message });
    }
}

module.exports=dataRoutes