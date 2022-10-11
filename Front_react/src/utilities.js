// Define our labelmap
const labelMap = {
    1: { name: 'licence', color: 'blue' },
}

// Define a drawing function
export const drawRect = (boxes, classes, scores, threshold, imgWidth, imgHeight, ctx) => {
    for (let i = 0; i <= boxes.length; i++) {
        if (boxes[i] && classes[i] && scores[i] > threshold) {
            console.log("placa")
            // Extract variables
            const [y, x, height, width] = boxes[i]
            console.log(boxes[i]);
            const text = classes[i]

            // Set styling
            ctx.strokeStyle = labelMap[text]['color']
            ctx.lineWidth = 10
            ctx.fillStyle = 'white'
            ctx.font = '30px Arial'

            // DRAW!!
            ctx.beginPath()
            ctx.fillText(labelMap[text]['name'] + ' - ' + Math.round(scores[i] * 100) / 100, x * imgWidth, y * imgHeight - 20)
            ctx.rect(
                x * imgWidth - 10,
                y * imgHeight - 10,
                (width - x) * imgWidth + 10,
                (height - y) * imgHeight + 10,
            );
            ctx.stroke()
        }
    }
}