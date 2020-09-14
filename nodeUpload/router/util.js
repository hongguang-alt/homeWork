const fs = require('fs')
const path = require('path')
const {
    ZIP,
} = require('../config')
module.exports = {
    asyncRes: (zip, ZIP_NAME) => {
        return new Promise((resolve, reject) => {
            zip
                .generateNodeStream({
                    streamFiles: true
                })
                .pipe(fs.createWriteStream(path.join(ZIP, ZIP_NAME)))
                .on('finish', () => {
                    resolve(1)
                });
        })
    }
}