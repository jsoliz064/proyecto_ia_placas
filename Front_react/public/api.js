var video = document.getElementById("video");
var canvas = document.getElementById("copia");
var ctx = canvas.getContext("2d");
var tamano=200;
canvas.width=200;
canvas.height=200;
canvas.style="border:1px solid red;"
let b=true

window.onload = function() {
    procesarCamara()
}

function procesarCamara() {
    if (b){
        video = document.getElementById("video");
    }
    if (video){
        if (b){
            b=false
        }
        ctx.drawImage(video, 0, 0, tamano, tamano, 0, 0, tamano, tamano);
    }
    setTimeout(procesarCamara, 2000);
}


