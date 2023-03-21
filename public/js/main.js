// import { enviarEmailPedido } from "../../scripts/mailer";



const agregarEventosBotones = () =>{
    

    const addToCardButtons = document.getElementsByClassName('btn-compra')
    console.log(addToCardButtons.length)
    
    
    for (let i = 0; i < addToCardButtons.length; i++) {
        const btn = addToCardButtons[i]
        const identifier = btn.dataset.target;
        console.log(identifier)
        btn.addEventListener('click', () => addToCart(identifier))
    }
    
    const addToCart = (id) => {
        // agregar acá la función de agregar al carrito
      console.log(id);
      
    }
}

document.addEventListener('DOMContentLoaded', agregarEventosBotones)
