const http=require('node:http')
const dataRoutes=require('./routes/Data.routes')
const publicRoutes=require('./routes/Public.routes')
const port=3000

const server=http.createServer((req,res)=>{

    if(req.url==='/health' && req.method==='GET'){
       try{
          res.writeHead(200,{'content-type':'application/json'})
          res.end(JSON.stringify({'status':'up','timeStamp':new Date()}))
       }
       catch(err){
          console.log(err.message)
       }
    }
    
    else if(req.url.startsWith('/api/data')){
        dataRoutes(req,res)
    }

    else if(req.url.startsWith('/public')){
        publicRoutes(req,res)
    }
    
    else{
        res.writeHead(404,{'content-type':'application/json'})
        res.end(JSON.stringify({'message':'Not Found!'}))
    }    
})

server.listen(port,()=>{
    console.log(`server is listening on http://localhost:${port}`)
})