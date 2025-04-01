const EventEmitter = require("node:events");

const emitter = new EventEmitter();

//event for item creation
emitter.on("itemCreated", (odata) => {
  console.log({ message: "Item created successfully!", addedData: odata });
});

//event for item updation
emitter.on("itemUpdated", (odata) => {
  console.log({ message: "Item updated successfully!", updatedData: odata });
});

//event for item deletion
emitter.on("itemDeletd", (odata) => {
  console.log({ message: "Item deleted successfully!", deleteData: odata });
});

module.exports = emitter;
