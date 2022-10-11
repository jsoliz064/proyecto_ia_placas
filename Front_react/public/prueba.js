let i = 0;
var tamano = 400;
var video = document.getElementById("video");
var canvasRef = document.getElementById("cvref");

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var currentStream = null;
var facingMode = "user";
var modelo = null;


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
            width: 640,
            height: 480,
        }
    }

    if (navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia(opciones)
            .then(function (stream) {
                currentStream = stream;
                video.srcObject = currentStream;
                procesarCamara();
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
    setTimeout(procesarCamara, 1000);
}


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

        const resized = tf.image.resizeBilinear(img, [640, 480])

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
            ctx2.lineWidth = 10
            ctx2.fillStyle = 'red'
            ctx2.font = '30px Arial'

            // DRAW!!
            ctx2.beginPath()
            ctx2.fillText(labelMap[text]['name'] + ' - ' + Math.round(scores[i] * 100) / 100, x * imgWidth, y * imgHeight - 20)
            ctx2.rect(
                x * imgWidth - 10,
                y * imgHeight - 10,
                (width - x) * imgWidth + 10,
                (height - y) * imgHeight + 10,
            );
            ctx2.stroke()
        }
    }
}

