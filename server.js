const http=require('node:http')
const dataRoutes=require('./routes/Data.routes')
const publicRoutes=require('./routes/Public.routes')
const {createResponse}=require('./helpers/helper')

const port=3000

const server=http.createServer((req,res)=>{

    switch(true){

        case req.url==='/health' && req.method==='GET' :
            try{
               res.writeHead(200,{'content-type':'application/json'})
               res.end(JSON.stringify({'status':'up','timeStamp':new Date()}))
               return
            }
            catch(err){
               console.log(err.message)
               return createResponse({ res, nstatusCode: 500, bisError: err.message });
            }
        break
         

        case req.url.startsWith('/api/data') :
            return dataRoutes(req,res)
        break
         
     
        case req.url.startsWith('/public') :
            return publicRoutes(req,res)
        break
         

        default :
            return createResponse({ res, nstatusCode: 404, bisError: 'Route not found !' }) 
    }
})

server.listen(port,(err)=>{
    if(err){
        console.log(err.message)
    }
    else{
        console.log(`server is listening on http://localhost:${port}`)
    }
})