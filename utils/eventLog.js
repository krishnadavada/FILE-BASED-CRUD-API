const EventEmitter = require('node:events')

const emitter=new EventEmitter()

emitter.on('itemCreated',()=>{
    console.log('Item created successfully!')
})

emitter.on('itemUpdated',()=>{
    console.log('Item updated successfully!')
})

emitter.on('itemDeletd',()=>{
    console.log('Item deleted successfully!')
})

module.exports=emitter