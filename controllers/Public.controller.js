const { readFile, writeFile } = require("node:fs").promises;
const path = require("node:path");
const { createResponse } = require("../helpers/helper");

async function defaultFileServe(req, res) {
    try {
        const odata = await readFile("public/index.html", "utf-8");
        res.writeHead(200, { "content-type": "text/html" });
        return res.end(odata);
    } 
    catch (err) {
        console.log(err.message);
        if (err) {
            if (err.code === "ENOENT") {
                return createResponse({
                    res,
                    nstatusCode: 404,
                    bisError: "File not found",
                });
            } 
            else {
                return createResponse({
                    res,
                    nstatusCode: 500,
                    bisError: "Internal server error",
                });
            }
        }
    }
}

async function staticFileServe(req, res) {
    try {
        const surl=req.url
        let sfilePath = surl.slice(1);
        let omimeTypes = {
            ".html": "text/html",
            ".js": "text/javascript",
            ".css": "text/css",
            ".json": "application/json",
            ".png": "image/png",
        };

        const sext = String(path.extname(surl)).toLowerCase();
        const scontentType = omimeTypes[sext];

        if (!scontentType) {
            return createResponse({
                res,
                nstatusCode: 404,
                bisError: "File not found",
            });
        }

        try {
            const odata = await readFile(sfilePath, "utf-8");
            res.writeHead(200, { "content-type": scontentType });
            return res.end(odata);
        } 
        catch (err) {
            console.log(err.message);
            if (err) {
                if (err.code === "ENOENT") {
                    return createResponse({
                        res,
                        nstatusCode: 404,
                        bisError: "File not found !",
                    });
                } else {
                    return createResponse({
                        res,
                        nstatusCode: 500,
                        bisError: "Internal server error !",
                    });
                }
            }
        }
    } 
    catch (err) {
        console.log(err.message);
        return createResponse({ res, nstatusCode: 500, bisError: err.message });
    }
}

module.exports = { defaultFileServe, staticFileServe };
