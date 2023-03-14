// TEXTO DE PRUEBA
// import { enviarEmailPedido } from "../../scripts/mailer";


const botonesProductos = document.querySelectorAll('botonesProductos')

console.log(botonesProductos)
botonesProductos.forEach((btn) => {
    btn.onClick = () =>{
        alert('click')
    }
});
