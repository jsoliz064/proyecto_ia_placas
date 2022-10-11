let i = 0;
var tamano = 400;
var video = document.getElementById("video");
var menu = document.getElementById("menu");

var canvasRef = document.getElementById("cvref");

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var currentStream = null;
var facingMode = "user";
var modelo = null;
let may = 0;
let smay = 0;
let socket=io();

(async () => {
    console.log("Cargando modelo...");
    modelo = await tf.loadGraphModel("./tensorflow/model.json");
    setInterval(() => {
        detect(modelo)
    }, 100);
    console.log("Modelo cargado");
})();


window.onload = function () {
    mostrarCamara();
}

function mostrarCamara() {
    var opciones = {
        audio: false,
        video: {
            width: 600,
            height: 440,
        }
    }

    if (navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia(opciones)
            .then(function (stream) {
                currentStream = stream;
                video.srcObject = currentStream;
                //procesarCamara();
                //predecir();
            })
            .catch(function (err) {
                alert("No se pudo utilizar la camara :(");
                alert(err);
            })
    } else {
        alert("No existe la funcion getUserMedia");
    }
}

function procesarCamara() {
    ctx.drawImage(video, 0, 0, tamano, tamano, 0, 0, tamano, tamano);
    //setTimeout(procesarCamara, 1000);
}
socket.on('connect', () => {
    console.log("connected")
});

socket.on('disconnect', () => {
    console.log('Se ha perdido la conexion');
});





const detect = async (net) => {
    // Check data is available
    if (navigator.mediaDevices.getUserMedia) {
        // Get Video Properties
        const videoWidth = video.videoWidth;
        const videoHeight = video.videoHeight;

        // Set canvas height and width
        canvasRef.width = videoWidth;
        canvasRef.height = videoHeight;

        // 4. TODO - Make Detections
        const img = tf.browser.fromPixels(video)

        const resized = tf.image.resizeBilinear(img, [videoWidth, videoHeight])

        const casted = resized.cast('int32')
        const expanded = casted.expandDims(0)
        const obj = await net.executeAsync(expanded);
        const boxes = await obj[6].array()
        const classes = await obj[4].array()
        const scores = await obj[7].array()

        // Draw mesh
        const ctx2 = canvasRef.getContext("2d");

        // 5. TODO - Update drawing utility
        // drawSomething(obj, ctx)  

        drawRect(boxes[0], classes[0], scores[0], 0.5, videoWidth, videoHeight, ctx2);

        tf.dispose(img)
        tf.dispose(resized)
        tf.dispose(casted)
        tf.dispose(expanded)
        tf.dispose(obj)
    }
};

const labelMap = {
    1: { name: 'Placa', color: 'blue' },
}

// Define a drawing function
const drawRect = (boxes, classes, scores, threshold, imgWidth, imgHeight, ctx2) => {

    for (let i = 0; i <= boxes.length; i++) {
        if (boxes[i] && classes[i] && scores[i] > threshold) {
            // Extract variables
            const [y, x, height, width] = boxes[i]
            const text = classes[i]

            // Set styling
            ctx2.strokeStyle = labelMap[text]['color']
            ctx2.lineWidth = 2
            ctx2.fillStyle = 'red'
            ctx2.font = '30px Arial'

            // DRAW!!
            ctx2.beginPath()
            //ctx2.fillText(labelMap[text]['name'] + ' - ' + Math.round(scores[i] * 100) / 100, x * imgWidth, y * imgHeight - 20)
            ctx2.fillText(labelMap[text]['name'], x * imgWidth, y * imgHeight - 20)

            const w = (width - x) * imgWidth + 10;
            const h = (height - y) * imgHeight + 10;
            const cx = x * imgWidth - 10;
            const cy = y * imgHeight - 10;

            ctx2.rect(cx, cy, w - 10, h,);
            ctx2.stroke()
            smay += 1
            if (smay == 15) {
                //download_img()
                upload()
                //send()
                smay = 0
                may = 0
            }
            if (Math.round(scores[i] * 100) / 100 > may) {
                canvas.width = w;
                canvas.height = h;
                canvas.style = "border:2px solid blue;"
                ctx.drawImage(video, cx, cy, w, h, 0, 0, w, h);
                may = Math.round(scores[i] * 100) / 100;
            }
        }
    }
}
function upload() {
    const base64=canvas.toDataURL();
    console.log(base64)
    socket.emit('upload',base64);
}

download_img = function () {
    let canvasUrl = canvas.toDataURL();
    // Create an anchor, and set the href value to our data URL
    const createEl = document.createElement('a');
    createEl.href = canvasUrl;

    // This is the name of our downloaded file
    createEl.download = "download-this-canvas";

    // Click the download button, causing a download, and then remove it
    createEl.click();
    createEl.remove();
};
function agregar() {
    console.log("send")

    let fd = new FormData();
    fd.append("documento", canvas.toDataURL());
    fetch('/api/placas/upload', {
        method: 'POST',
        body: fd
    })
        .then(response => console.log(response))
        .then(datos => {
            console.log(datos)
        })
}



