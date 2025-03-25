const emitter = require('../utils/eventLog')
const { readFile, writeFile } = require('node:fs').promises
const { v4: uuidv4 } = require('uuid')
const { date, createResponse } = require('../helpers/helper')
const { validateId,validateData }=require('../Validators/validate')

async function getAllData(req, res) {
    try {
        let odata = await readFile('data.json', 'utf-8')
        odata = JSON.parse(odata)
        odata = odata.filter((i) => i.sstatus === 'available')
        return createResponse({ res, nstatusCode: 200, odata });
    }
    catch (err) {
        console.log(err.message)
        if (err) {
            if (err.code === 'ENOENT') {
                return createResponse({ res, nstatusCode: 404, bisError: 'File not found !' });
            }
            else {
                return createResponse({ res, nstatusCode: 500, bisError: 'Internal server error !' });
            }
        }
    }
}


async function getDataById(req, res, nid) {
    try {

        if(!validateId(nid)){
            return createResponse({ res, nstatusCode: 400, sisMessage: 'Invalid Id !' })
        }
    
        const odata = await readFile('data.json', 'utf-8')
        let ogetData = JSON.parse(odata)
        const ngetId = ogetData.findIndex((i) => i.nid === nid)

        if (ngetId === -1) {
            return createResponse({ res, nstatusCode: 404, sisMessage: 'Data not found !' })
        }

        ogetData = ogetData.filter((i) => i.nid === nid)
        return createResponse({ res, nstatusCode: 200, odata: ogetData })
    }
    catch (err) {
        console.log(err.message)
        if (err) {
            if (err.code === 'ENOENT') {
                return createResponse({ res, nstatusCode: 404, isError: 'File not found !' });
            }
            else {
                return createResponse({ res, nstatusCode: 500, isError: 'Internal server error !' });
            }
        }
    }
}

function addData(req, res) {
    try {

        let obody = ''

        req.on('data', (chunk) => {
            obody += chunk.toString()
        })

        req.on('end', async () => {

            if (!obody.trim()) {
                return createResponse({ res, nstatusCode: 400, sisMessage: 'No data provided !' });
            }

            try {
                JSON.parse(obody)
            }
            catch (err) {
                return createResponse({ res, nstatusCode: 400, sisMessage: 'Invalid JSON !' })
            }

            try {
                const odata = await readFile('data.json', 'utf-8')
                let ooldData = JSON.parse(odata)

                const onewData = JSON.parse(obody)
                const odataExist = ooldData.some((i) => i.nid === onewData.nid)

                if (odataExist) {
                    return createResponse({ res, nstatusCode: 400, sisMessage: 'Data already exist' })
                }

                const ovalidate=validateData(onewData)

                if(!ovalidate.bisValid){
                    return createResponse({ res, nstatusCode: 400, sisMessage: ovalidate.smessage })
                }

                onewData.nid = uuidv4()
                onewData.ncreatedAt = date()
                onewData.nupdatedAt = date()

                ooldData.push(onewData)

                await writeFile('data.json', JSON.stringify(ooldData))
                emitter.emit('itemCreated', onewData)
                return createResponse({ res, nstatusCode: 201, sisMessage: 'Item created successfully' })
            }
            catch (err) {
                console.log(err.message)
                if (err) {
                    if (err.code === 'ENOENT') {
                        return createResponse({ res, nstatusCode: 404, isError: 'File not found' });
                    }
                    else {
                        return createResponse({ res, nstatusCode: 500, isError: 'Internal server error' });
                    }
                }
            }
        })
    }
    catch (err) {
        console.log(err.message)
        return createResponse({ res, nstatusCode: 500, isError: err.message });
    }
}

function updateData(req, res, nid) {
    try {

        if(!validateId(nid)){
            return createResponse({ res, nstatusCode: 400, sisMessage: 'Invalid Id !' })
        }
        
        let obody = ''

        req.on('data', (chunk) => {
            obody += chunk.toString()
        })

        req.on('end', async () => {

            if (!obody.trim()) {
                return createResponse({ res, nstatusCode: 400, sisMessage: 'No data provided !' });
            }

            try {
                JSON.parse(obody)
            }
            catch (err) {
                return createResponse({ res, nstatusCode: 400, sisMessage: 'Invalid JSON !' })
            }

            try {

                let odata = await readFile('data.json', 'utf-8')
                let ooldData = JSON.parse(odata)

                try {
                    JSON.parse(obody)
                }
                catch (err) {
                    return createResponse({ res, nstatusCode: 400, sisMessage: 'Invalid JSON !' })
                }

                const onewData = JSON.parse(obody)

                const ngetId = ooldData.findIndex((i) => i.nid === nid)

                if (ngetId === -1) {
                    return createResponse({ res, nstatusCode: 404, sisMessage: 'User not found !' })
                }

                onewData.nid = nid
                onewData.ncreatedAt = ooldData[ngetId].ncreatedAt
                onewData.nupdatedAt = date()

                ooldData[ngetId] = { ...ooldData[ngetId], ...onewData }

                await writeFile('data.json', JSON.stringify(ooldData))

                emitter.emit('itemUpdated', ooldData[ngetId])
                return createResponse({ res, nstatusCode: 200, sisMessage: 'Item updated successfully !' });
            }
            catch (err) {
                console.log(err.message)
                if (err) {
                    if (err.code === 'ENOENT') {
                        return createResponse({ res, nstatusCode: 404, bisError: 'File not found !' });
                    }
                    else {
                        return createResponse({ res, nstatusCode: 500, bisError: 'Internal server error !' });
                    }
                }
            }
        })
    }
    catch (err) {
        console.log(err.message)
        return createResponse({ res, nstatusCode: 500, bisError: err.message });
    }
}

async function deleteData(req, res, nid) {
    try {

        if(!validateId(nid)){
            return createResponse({ res, nstatusCode: 400, sisMessage: 'Invalid Id !' })
        }

        try {
        
            let odata = await readFile('data.json', 'utf-8')
            let ooldData = JSON.parse(odata)

            const ngetId = ooldData.findIndex((i) => i.nid === nid)

            if (ngetId === -1) {
                return createResponse({ res, nstatusCode: 404, sisMessage: 'Data not found !' })
            }

            const odeletedData = ooldData.filter((i) => i.nid === nid)
            ooldData = ooldData.filter((i) => i.nid !== nid)

            await writeFile('data.json', JSON.stringify(ooldData))
            emitter.emit('itemDeletd', odeletedData)
            return createResponse({ res, nstatusCode: 200, sisMessage: 'Item deleted successfully !' });
        }
        catch (err) {
            console.log(err.message)
            if (err) {
                if (err.code === 'ENOENT') {
                    createResponse({ res, nstatusCode: 404, bisError: 'File not found !' });
                }
                else {
                    createResponse({ res, nstatusCode: 500, bisError: 'Internal server error !' });
                }
            }
        }
    }
    catch (err) {
        console.log(err.message)
        return createResponse({ res, nstatusCode: 500, bisError: err.message });
    }
}



module.exports = { getAllData, getDataById, addData, updateData, deleteData }