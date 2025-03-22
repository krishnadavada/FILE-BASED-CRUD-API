const fs=require('node:fs')
const path=require('node:path')

function defaultFileServe(req,res){
    try{
        fs.readFile('public/index.html',(err,data)=>{
            if(err){
                if(err.code==='ENOENT'){
                    res.writeHead(404,{'content-type':'application/json'})
                    res.end(JSON.stringify({'error':'File not found'}))
                    return
                }
                else{
                    res.writeHead(500,{'content-type':'application/json'})
                    res.end(JSON.stringify({'error':'Internal server error'}))
                    return
                }
            }
            res.writeHead(200,{'content-type':'text/html'})
            res.end(data,'utf-8')
        })
    }
    catch(err){
        console.log(err.message)
    }
}

function staticFileServe(req,res){
    try{
        let filePath=req.url.slice(1)
        let mimeTypes = {
            '.html': 'text/html',
            '.js': 'text/javascript',
            '.css': 'text/css',
            '.json': 'application/json',
            '.png': 'image/png'
        }

        const ext=String(path.extname(req.url)).toLowerCase()
        const contentType=mimeTypes[ext]

        if(contentType===undefined){
            res.writeHead(500,{'content-type':'application/json'})
            res.end(JSON.stringify({'error':'Internal server error'}))
            return
        }

        fs.readFile(filePath,(err,data)=>{
            if(err){
                if(err.code==='ENOENT'){
                    res.writeHead(404,{'content-type':'application/json'})
                    res.end(JSON.stringify({'error':'File not found'}))
                    return
                }
                else{
                    res.writeHead(500,{'content-type':'application/json'})
                    res.end(JSON.stringify({'error':'Internal server error'}))
                    return
                }
            }
            res.writeHead(200,{'content-type':contentType})
            res.end(data,'utf-8')
        })
    }
    catch(err){
       console.log(err.message)
    }
}

module.exports={defaultFileServe,staticFileServe}