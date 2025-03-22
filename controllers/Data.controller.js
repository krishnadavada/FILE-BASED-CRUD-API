const emitter=require('../utils/eventLog')
const fs=require('node:fs')
const { v4: uuidv4, validate: uuidValidate  } = require('uuid')

function date(){
    let date = new Date().getDate();
    let month = new Date().getMonth() + 1;
    let year = new Date().getFullYear();
    return `${date}/${month}/${year}`
}

function getAllData(req,res){
    try{
        fs.readFile('data.json',(err,data)=>{
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
          res.writeHead(200,{'content-type':'application/json'})
          res.end(data,'utf-8')
        })
     }
     catch(err){
        console.log(err.message)
     }
}

function getDataById(req,res,id){
    try{
    
        if(!uuidValidate(id)){
            res.writeHead(400,{'content-type':'application/json'})
            return res.end(JSON.stringify({'message':'Invalid id!'}))         
        }
            
        fs.readFile('data.json',(err,data)=>{
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
    
            let getData=Array.from(JSON.parse(data.toString('utf-8')))
    
            const getId=getData.findIndex((i)=>i.id===id)
                     
            if(getId===-1){
                res.writeHead(404, { 'Content-Type': 'application/json' })
                res.end(JSON.stringify({ message: 'User not found' }))
                return
            }
    
            getData=getData.filter((i)=>i.id===id)
    
            res.writeHead(200,{'content-type':'application/json'})
            res.end(JSON.stringify(getData))
        })
    }
    catch(err){
        console.log(err.message)
    }
}

function addData(req,res){
    try{
        fs.readFile('data.json',(err,data)=>{
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

            let oldData=Array.from(JSON.parse(data.toString('utf-8')))

            let body=''

            req.on('data',(chunk)=>{
                body+=chunk.toString()
            })

            req.on('end',()=>{

                if(!body.trim()){
                    res.writeHead(404,{'content-type':'application/json'})
                    res.end(JSON.stringify({'message':'Body not found!'}))
                    return
                }
                const newData=JSON.parse(body)

                const dataExist=oldData.some((i)=>i.id===newData.id)

                if(dataExist){
                    res.writeHead(400,{'content-type':'application/json'})
                    res.end(JSON.stringify({'message':'User already exist!'}))
                    return
                }

                if(newData.name===undefined || newData.quantity===undefined || newData.price===undefined || newData.status===undefined){
                    res.writeHead(404,{'content-type':'application/json'})
                    res.end(JSON.stringify({'message':'Invalid data!'}))
                }

                newData.id=uuidv4()
                newData.createdAt=date()
                newData.updatedAt=date()
      
                oldData.push(newData)

                fs.writeFile('data.json',JSON.stringify(oldData),(err)=>{
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
                    emitter.emit('itemCreated')
                    res.writeHead(201,{'content-type':'application/json'})
                    res.end(JSON.stringify({'message':'Data saved successfully'}))
                })
            })
        })
    }
    catch(err){
        console.log(err.message)
    }
}

function updateData(req,res,id){
    try{

        if(!uuidValidate(id)){
            res.writeHead(400,{'content-type':'application/json'})
            return res.end(JSON.stringify({'message':'Invalid id!'}))         
        }
        
        fs.readFile('data.json',(err,data)=>{
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
  
            let oldData=Array.from(JSON.parse(data.toString('utf-8')))
    
            let body=''
  
            req.on('data',(chunk)=>{
                body+=chunk.toString()
            })
  
            req.on('end',()=>{
  
                if(!body.trim()){
                    res.writeHead(404,{'content-type':'application/json'})
                    res.end(JSON.stringify({'message':'Body not found!'}))
                    return
                }  
                const newData=JSON.parse(body)
  
                const getId=oldData.findIndex((i)=>i.id===id)
               
                if(getId===-1){
                    res.writeHead(404, { 'Content-Type': 'application/json' })
                    res.end(JSON.stringify({ message: 'User not found' }))
                    return
                }

                newData.id=id
                newData.createdAt=oldData[getId].createdAt
                newData.updatedAt=date()
              
                oldData[getId]={...oldData[getId],...newData}
  
                fs.writeFile('data.json',JSON.stringify(oldData),(err)=>{
                    if(err){
                        if(err.code==='ENOENT'){
                            res.writeHead(404,{'content-type':'application/json'})
                            res.end(JSON.stringify({'error':'File not found'}))
                            retuen
                        }
                        else{
                            res.writeHead(500,{'content-type':'application/json'})
                            res.end(JSON.stringify({'error':'Internal server error'}))
                            return
                        }
                    }
                    emitter.emit('itemUpdated')
                    res.writeHead(201,{'content-type':'application/json'})
                    res.end(JSON.stringify({'message':'Data updated successfully'}))
                })
            })
        })
    }
    catch(err){
        console.log(err.message)
    }
}

function deleteData(req,res,id){
    try{
    
        if(!uuidValidate(id)){
            res.writeHead(400,{'content-type':'application/json'})
            return res.end(JSON.stringify({'message':'Invalid id!'}))         
        }

        fs.readFile('data.json',(err,data)=>{
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
    
            let oldData=Array.from(JSON.parse(data.toString('utf-8')))
    
            oldData=oldData.filter((i)=>i.id!==id)
                
            fs.writeFile('data.json',JSON.stringify(oldData),(err)=>{
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
                emitter.emit('itemDeletd')
                res.writeHead(201,{'content-type':'application/json'})
                res.end(JSON.stringify({'message':'Data deleted successfully'}))
            })
        })
    }
    catch(err){
        console.log(err.message)
    }
}

module.exports={getAllData,getDataById,addData,updateData,deleteData}