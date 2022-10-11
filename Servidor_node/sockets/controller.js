const fs = require('fs');
const path = require("path");
const request = require('request');
const FormData = require('form-data');
const { Canvas, createCanvas, loadImage } = require('canvas')

const socketController = async (socket = new Socket(), io) => {

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
            fs.writeFile(path.join(__dirname, "../public/img/placa.png"), buffer, (err) => {
                console.log(err);
            })
            console.log("Uploaded")
            api_predecir()
        })();
    });

    function api_predecir() {
        fs.readFile(path.join(__dirname, "../public/img/placa.png"), (err, data) => {
            if (err) throw err;
            var req = request.post("http://127.0.0.1:8000/api/predecir", function (err, resp, body) {
                if (err) {
                  console.log('Error!');
                } else {
                  socket.emit('response',body);
                }
              });
              var form = req.form();
              form.append('documento', data, {
                filename: 'placa.png',
                contentType: 'png',
              });
    
        });
    }
    
}



module.exports = {
    socketController
}

