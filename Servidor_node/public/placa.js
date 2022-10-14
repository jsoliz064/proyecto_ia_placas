let socket = io();
let placas=[];
socket.on('connect', () => {
    console.log("connected")
    socket.emit('index');
});
socket.on('listar',(resultado) => {
    console.log(resultado)
    placas=resultado;
    imprimir()
});

function imprimir(){
    var html="";
    for (let i = 0; i < placas.length; i++) {
        let tipo="Aceptado"
        if (placas[i].tipo==0){
            tipo="No Aceptado"
        }
        var html2=`<tr>
        <td id="tbusuario">${placas[i].id}</td>
        <td id="tbusuario">${placas[i].nombre}</td>
        <td id="tbaciertos">${tipo}</td>
        </tr>`
        html=html+html2;
    }
    var divjugador=document.getElementById('tabla');
    divjugador.innerHTML=html;
}

function guardar() {
    let nombre = document.getElementById("nombre").value;
    var selected = document.getElementById("tipo");
    var tipo = selected.options[selected.selectedIndex].value;
    socket.emit('guardar', nombre, tipo);
    socket.emit('index');
}