const fs = require('fs');
const path = require("path");
const request = require('request');
const FormData = require('form-data');
const { Canvas, createCanvas, loadImage } = require('canvas')
const pool = require('../database/configpg');

const socketController = async (socket = new Socket(), io) => {

    socket.on('guardar', (nombre, tipo) => {
        console.log('guardar')
        return new Promise((resolve, reject) => {
            pool.query(`INSERT INTO placas (nombre, tipo) VALUES (?,?);`,[nombre,tipo], function (err, result) {
                if (err) {
                    reject(err);
                } else {
                    console.log('usuario creado')
                }
            });
        });
    });

    socket.on('index',()=>{
        return new Promise((resolve, reject) => {
            pool.query('SELECT * FROM placas', function (err, result) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(result);
                    socket.emit('listar',result);
                }
            });
        });
    });

    socket.on('upload', (base64, width, height) => {
        if (width == null)
            width = 400
        if (height == null)
            height = 300
        const canvas = createCanvas(width, height)
        const context = canvas.getContext('2d')
        let img = Canvas.Image;
        (async () => {
            img = await loadImage(base64);
            context.drawImage(img, 0, 0)
            const buffer = canvas.toBuffer('image/png')
            /* fs.writeFile(path.join(__dirname, "../public/img/placa.png"), buffer, (err) => {
                console.log(err);
            }) */
            console.log("Uploaded")
            api_predecir(buffer)
        })();
    });

    function api_predecir(buffer) {
        /*   fs.readFile(path.join(__dirname, "../public/img/placa.png"), (err, data) => {
              if (err) throw err; */
        var req = request.post("http://127.0.0.1:8000/api/predecir", function (err, resp, body) {
            if (err) {
                console.log('Error!');
            } else {
                pool.query('SELECT * FROM `placas` WHERE nombre=?',[body], function (err, result) {
                    if (err){
                        console.log(err)
                    }
                    console.log(result)
                    if (result){
                        if (result[0].tipo==0)
                        console.log(result.RowDataPacket)
                        body=body+" Acceso Denegado"
                    }
                    socket.emit('response', body);
                });
            }
        });
        var form = req.form();
        form.append('documento', buffer, {
            filename: 'placa.png',
            contentType: 'png',
        });

        /* }); */
    }

}



module.exports = {
    socketController
}

