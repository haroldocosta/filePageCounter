const pdfjsLib = require('pdfjs-dist'), path = require('path'), fs = require('fs')

let basePath = "/Users/haroldo/Documents/ABARIS"

let planilha = Object()

const fromDir = (startPath,filter,callback) => {
    try {
        if (!fs.existsSync(startPath)){
            console.log("no dir ",startPath)
            return
        }
        var files=fs.readdirSync(startPath)
        for(var i=0; i<files.length; i++){
            var filename=path.join(startPath,files[i])
            var stat = fs.lstatSync(filename)
            if (stat.isDirectory()){
                fromDir(filename,filter,callback) //recurse
            }
            else if (filter.test(filename)){
                callback(filename)
            }
        }
    } catch (error) {
        console.log(error)
    }
}

const getPaginas = async () => {
    await fromDir(basePath,/\.pdf$/, async (filename) => {
        const doc = await pdfjsLib.getDocument(filename)
        var numPages = doc.numPages
        let linha = filename.replace(basePath,"").split("/")[1]
        let coluna = filename.replace(basePath,"").split("/")[2]
        if(!planilha[linha]){
            planilha[linha] = {}
        }
        if(!planilha[linha][coluna]){
            planilha[linha][coluna] = 0
        }
        planilha[linha][coluna] += Number(numPages)
        console.log(planilha)
    })
}

getPaginas()
