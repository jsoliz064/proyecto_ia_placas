var fs = require('fs');


const socketController = async (socket = new Socket(), io) => {

    socket.on('upload', (base64) => {
        /* CODIGO QUE RECIBE BASE64 */
        /* GUARDAR EN PUBLIC/IMG */
    });
}

module.exports = {
    socketController
}

