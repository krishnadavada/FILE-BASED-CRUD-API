const EventEmitter = require('node:events')

const emitter=new EventEmitter()

emitter.on('itemCreated',(odata)=>{
    console.log({"message":"Item created successfully!","addedData":odata})
})

emitter.on('itemUpdated',(odata)=>{
    console.log({"message":"Item updated successfully!","updatedData":odata})
})

emitter.on('itemDeletd',(odata)=>{
    console.log({"message":"Item deleted successfully!","deleteData":odata})
})

module.exports=emitter