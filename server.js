const http=require('node:http')
const {readFile,writeFile}=require('node:fs').promises;
const EventEmitter = require('node:events')
const path=require('node:path')
const { v4: uuidv4, validate: uuidValidate  } = require('uuid')
const port=3000

//use whole surl for css and js
//make function for createResponse ({req,res,status,message,odata})

//make function for read and write file (use promise)
//convert switch case

function date(){
    let nDate = new Date().getDate();
    let nMonth = new Date().getMonth() + 1;
    let nYear = new Date().getFullYear();
    return `${nDate}/${nMonth}/${nYear}`
}

function createResponse({res,nstatusCode,odata,bisError=false,sisMessage=""}){
    if(bisError){
        res.writeHead(nstatusCode,{'content-type':'application/json'})
        return res.end(JSON.stringify({'error':bisError}))
    }
    else if(sisMessage){
        res.writeHead(nstatusCode,{'content-type':'application/json'})
        return res.end(JSON.stringify({'message':sisMessage}))
    }
    else if(odata){
        res.writeHead(nstatusCode,{'content-type':'application/json'})
        return res.end(JSON.stringify({'data':odata}))
    }
}

function validateId(res,nid){
    if(!uuidValidate(nid)){
        return createResponse({ res, nstatusCode: 400, sisMessage: 'Invalid Id !' })
    }
    return
}

function validateData(res,onewData){
    if(!onewData.sname || !onewData.nquantity || !onewData.nprice || !onewData.sstatus){
        return createResponse({res, nstatusCode:400, sisMessage:'Invalid data!'})
    }
    else if(typeof(onewData.sname)!=='string'){
        return createResponse({res, nstatusCode:400, sisMessage:'Invalid data type of name!'})
    }
    else if(typeof(onewData.nquantity)!=='number'){
        return createResponse({res, nstatusCode:400, sisMessage:'Invalid data type of quantity!'})
    }
    else if(typeof(onewData.nprice)!=='number'){
        return createResponse({res, nstatusCode:400, sisMessage:'Invalid data type of price!'})
    }
    else if(typeof(onewData.sstatus)!=='string'){
        return createResponse({res, nstatusCode:400, sisMessage:'Invalid data type of status!'})
    }
    else if(onewData.nquantity<0 || onewData.nprice<0){
        return createResponse({res, nstatusCode:400, sisMessage:'Invalid quantity or price!'})
    }
    return
}

const emitter=new EventEmitter()

const server=http.createServer((req,res)=>{
    
    const surl=req.url
    const smethod=req.method
//item print
    emitter.on('itemCreated',(odata)=>{
        console.log({"message":"Item created successfully!","addedData":odata})
    })

    emitter.on('itemUpdated',(odata)=>{
        console.log({"message":"Item updated successfully!","updatedData":odata})
    })

    emitter.on('itemDeletd',(odata)=>{
        console.log({"message":"Item deleted successfully!","deleteData":odata})
    })

    switch(true){
        
        case surl==='/health' && smethod==='GET' :
            try{
                res.writeHead(200,{'content-type':'application/json'})
                return res.end(JSON.stringify({'status':'up','timeStamp':new Date()}))
            }
            catch(err){
                console.log(err.message)
                return createResponse({ res, nstatusCode: 500, bisError: err.message });
            }
        break
    

        case surl==='/api/data' && smethod==='GET' :
            try{
                async function getAllData(){
                    try{
                        let odata=await readFile('data.json','utf-8')
                        odata=JSON.parse(odata)
                        odata=odata.filter((i)=>i.sstatus==='available')
                        return createResponse({ res, nstatusCode: 200, odata:odata });
                    } 
                    catch(err){
                        console.log(err.message)
                        if(err){
                            if(err.code==='ENOENT'){
                                return createResponse({ res, nstatusCode: 404, bisError: 'File not found !' });
                            }
                            else{
                                return createResponse({ res, nstatusCode: 500, bisError: 'Internal server error !' });
                            }
                        }
                    }
                }
                getAllData()
            }
            catch(err){
                return createResponse({ res, nstatusCode: 500, bisError: err.message });
            }
        break


        case surl.startsWith('/api/data') && smethod==='GET' :
            try{
                const nid=surl.split('/')[3]

                validateId(res,nid)

                async function getDataByID(){
                    try{
                        const sdata=await readFile('data.json','utf-8')
                        let ogetData=JSON.parse(sdata)
                        const ngetId=ogetData.findIndex((i)=>i.nid===nid)
                     
                        if(ngetId===-1){
                            return createResponse({res, nstatusCode: 404, sisMessage:'Data not found !'})
                        }
    
                        ogetData=ogetData.filter((i)=>i.nid===nid)
                        return createResponse({res, nstatusCode:200, odata:ogetData})
                    }
                    catch(err){
                        console.log(err.message)
                        if(err){
                            if(err.code==='ENOENT'){
                                return createResponse({ res, nstatusCode: 404, isError: 'File not found !' });
                            } 
                            else{
                                return createResponse({ res, nstatusCode: 500, isError: 'Internal server error !' });
                            }
                        }
                    }
                }
                getDataByID()
            }
            catch(err){
                console.log(err.message)
                return createResponse({ res, nstatusCode: 500, isError: err.message });
            }
        break


        case surl==='/api/data' && smethod==='POST' :
            try{
            
                let obody=''

                req.on('data',(chunk)=>{
                    obody+=chunk.toString()
                })

                req.on('end',async ()=>{

                    if(!obody.trim()){
                        return createResponse({ res, nstatusCode: 400, sisMessage: 'No data provided !' });
                    }

                    try{
                        JSON.parse(obody)
                    }
                    catch(err){
                        return createResponse({res, nstatusCode:400, sisMessage:'Invalid JSON !'})
                    }

                    try{
                        const odata=await readFile('data.json','utf-8')
                        let ooldData=JSON.parse(odata)

                        const onewData=JSON.parse(obody)
                        const odataExist=ooldData.some((i)=>i.nid===onewData.nid)

                        if(odataExist){
                            return createResponse({res, nstatusCode:400, sisMessage:'Data already exist'})
                        }

                        validateData(res,onewData)
                        
                        onewData.nid=uuidv4()
                        onewData.ncreatedAt=date()
                        onewData.nupdatedAt=date()
        
                        ooldData.push(onewData)

                        await writeFile('data.json',JSON.stringify(ooldData))
                        emitter.emit('itemCreated',onewData)
                        createResponse({res, nstatusCode:201, sisMessage:'Item created successfully'})
                        return
                    }
                    catch (err) {
                        console.log(err.message)
                        if(err){
                            if(err.code==='ENOENT'){
                                return createResponse({ res, nstatusCode: 404, isError: 'File not found' });
                            }
                            else{
                                return createResponse({ res, nstatusCode: 500, isError: 'Internal server error' });
                            }
                        }
                    }
                })
            }
            catch(err){
                console.log(err.message)
                return createResponse({ res, nstatusCode: 500, isError: err.message });
            }
        break
    

        case surl.startsWith('/api/data') && smethod==='PUT' :
            try{
                const nid=surl.split('/')[3]

                validateId(res,nid)

                let obody=''
    
                req.on('data',(chunk)=>{
                    obody+=chunk.toString()
                })
    
                req.on('end',async()=>{
    
                    if(!obody.trim()){
                        return createResponse({ res, nstatusCode: 400, sisMessage: 'No data provided !' });
                    }
    
                    try{
                        JSON.parse(obody)
                    }
                    catch(err){
                        return createResponse({res, nstatusCode:400, sisMessage:'Invalid JSON !'})
                    }
    
                    try{
      
                        let odata=await readFile('data.json','utf-8')
                        let ooldData=JSON.parse(odata)
                        
                        try{
                            JSON.parse(obody)
                        }
                        catch(err){
                            return createResponse({res, nstatusCode:400, sisMessage:'Invalid JSON !'})
                        }

                        const onewData=JSON.parse(obody)

                        const ngetId=ooldData.findIndex((i)=>i.nid===nid)
                     
                        if(ngetId===-1){
                            return createResponse({res, nstatusCode: 404, sisMessage:'User not found !'})
                        }
    
                        onewData.nid=nid
                        onewData.ncreatedAt=ooldData[ngetId].ncreatedAt
                        onewData.nupdatedAt=date()
                    
                        ooldData[ngetId]={...ooldData[ngetId],...onewData}

                        await writeFile('data.json',JSON.stringify(ooldData))
                    
                        emitter.emit('itemUpdated',ooldData[ngetId])
                        return createResponse({ res, nstatusCode: 200, sisMessage: 'Item updated successfully !' });
                    }
                    catch(err){
                        console.log(err.message)
                        if(err){
                            if(err.code==='ENOENT'){
                                return createResponse({ res, nstatusCode: 404, bisError: 'File not found !' });
                            }
                            else{
                                return createResponse({ res, nstatusCode: 500, bisError: 'Internal server error !' });
                            }
                        }                
                    }
                })
            }
            catch(err){
                console.log(err.message)
                return createResponse({ res, nstatusCode: 500, bisError: err.message });
            }
        break
    

        case surl.startsWith('/api/data') && smethod==='DELETE' :
            try{
                const nid=surl.split('/')[3]

                validateId(res,nid)

                async function deleteDataById() {
                    try{
                        let odata=await readFile('data.json','utf-8')
                        let ooldData=JSON.parse(odata)

                        const odeletedData=ooldData.filter((i)=>i.nid===nid)
                        ooldData=ooldData.filter((i)=>i.nid!==nid)

                        await writeFile('data.json',JSON.stringify(ooldData))
                        emitter.emit('itemDeletd',odeletedData)
                        return createResponse({ res, nstatusCode: 200, sisMessage: 'Item deleted successfully !' });
                    }
                    catch(err){
                        console.log(err.message)
                        if(err){
                            if(err.code==='ENOENT'){
                                createResponse({ res, nstatusCode: 404, bisError: 'File not found !' });
                            }
                            else{
                                createResponse({ res, nstatusCode: 500, bisError: 'Internal server error !' });
                            }
                        }
                    }
                }        
                deleteDataById()
            }
            catch(err){
                console.log(err.message)
                return createResponse({ res, nstatusCode: 500, bisError: err.message });
            }
        break


        case surl==='/public' && smethod==='GET' :

            try{
                async function defaultFile(){
                    try{
                        const odata=await readFile('public/index.html','utf-8')
                        res.writeHead(200,{'content-type':'text/html'})
                        return res.end(odata)                    
                    }
                    catch(err){
                        console.log(err.message)
                        if(err){
                            if(err.code==='ENOENT'){
                                return createResponse({ res, nstatusCode: 404, bisError: 'File not found' });
                            }
                            else{
                                return createResponse({ res, nstatusCode: 500, bisError: 'Internal server error' });
                            }
                        }
                    }
                }
                defaultFile()
            }
            catch(err){
                console.log(err.message)
                createResponse({ res, nstatusCode: 500, bisError: err.message });
            }
        break


        case surl.startsWith('/public') && smethod==='GET' :

            try{
                let sfilePath=surl.slice(1)
                let omimeTypes = {
                    '.html': 'text/html',
                    '.js': 'text/javascript',
                    '.css': 'text/css',
                    '.json': 'application/json',
                    '.png': 'image/png'
                }

                const sext=String(path.extname(surl)).toLowerCase()
                const scontentType=omimeTypes[sext]

                if(!scontentType){
                    return createResponse({ res, nstatusCode: 404, bisError: 'File not found' });
                }

                async function staticFile(){
                    try{
                        const odata=await readFile(sfilePath,'utf-8')
                        res.writeHead(200,{'content-type':scontentType})
                        return res.end(odata)
                    }
                    catch(err){
                        console.log(err.message)
                        if(err){
                            if(err.code==='ENOENT'){
                                return createResponse({ res, nstatusCode: 404, bisError:'File not found !' });
                            }
                            else{
                                return createResponse({ res, nstatusCode: 500, bisError:'Internal server error !' });
                            }
                        }
                    }
                }
                staticFile()
            }
            catch(err){
                console.log(err.message)
                return createResponse({ res, nstatusCode: 500, bisError:err.message });
            }
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