const fs = require("fs").promises
const path = require("path")
const logger = require("./logger")


class FileSystemUtil {
    static async readJsonFile(filePath){
        try {
            const data = await fs.readFile(filePath, "utf-8")
            return JSON.parse(data)
        } catch (error) {
            logger.error(`Failed to read JSON file at ${filePath}: ${error.message}`)
            throw error
        }
    }

    static async writeJsonFile(filePath, data){

    }

    static async fileExists(){

    }

    static async 
}