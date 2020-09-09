const fs = require('fs')
const path = require('path')
const {
    ZIP,
    ZIP_NAME
} = require('../config')
module.exports = {
    asyncRes: (zip) => {
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