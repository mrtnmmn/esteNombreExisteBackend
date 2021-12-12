let express = require('express');
let cors = require('cors')
let app = express();

app.use(cors())

const csv = require('csv-parser')
const fs = require('fs')

const hombres = [], mujeres = [];
let cont = 0

fs.createReadStream('spanish-names/hombres.csv')
    .pipe(csv())
    .on('data', (data) => hombres.push(data))



fs.createReadStream('spanish-names/mujeres.csv')
    .pipe(csv())
     .on('data', (data) => mujeres.push(data))


function checkNombre (arr, nombre) {
    for (let i = 0; i < arr.length; i++ ) {
        if (arr[i].nombre === nombre) {
            return true
        }
    }
}

function countNames (arr, nombre) {

    for (let i = 0; i < arr.length; i++ ) {
        if (arr[i].nombre === nombre) {
            cont += 1
        }
    }
}


app.get('/existe/:nombre', (req, res) => {

    const nombre = (req.params.nombre).toUpperCase()

    if (checkNombre(hombres, nombre)) {
        return res.json({"nombre_de_mujer":false,"nombre_de_hombre":true})
    }

    if (checkNombre(mujeres, nombre)) {
        return res.json({"nombre_de_mujer":true,"nombre_de_hombre":false})
    }

    return res.json({"nombre_de_mujer":false,"nombre_de_hombre":false})


})

app.get('/contar', (req,res) => {
    const cont = hombres.length + mujeres.length

    return res.json({"cont":cont})
})

app.get('/contar/:nombre', (req, res) => {

    const nombre = (req.params.nombre).toUpperCase()

    countNames(hombres, nombre)
    countNames(mujeres, nombre)

    return res.json({"res": cont})

})

app.listen(4000, () => {
    console.log('Servidor encendido')
})
