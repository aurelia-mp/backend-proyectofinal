import {
    productosDao as productosApi,
    carritosDao as carritosApi
} from '../daos/index.js'

export const crearCarrito = (req,res) =>{
    // crear  un carrito vacío y devuelve  el id
    let timestamp = Date.now()
    let nuevoCarrito = {
        items: [],
        cart_timestamp: timestamp
    } 
    carritosApi.save(nuevoCarrito)
    .then(id => res.send(`Carrito creado con el id ${id}`))
}

export const borrarCarrito = (req,res) =>{
    let id = req.params.id
    carritosApi.deleteById(id)
    .then(resp =>{
        res.send('Carrito eliminado')
    })
}

export const getCarrito = (req,res) => {
    //  Lista los productos del carrito
    let id= req.params.id
    carritosApi.getById(id)
    .then((carrito) => {
        let prods = carrito[0]["items"]
        res.json({"Productos en el carrito:" : prods})
    })
    .catch((err) =>{
        res.send("El carrito requerido no existe")
    })
}

export const agregarItemAlCarrito  = (req,res)  =>{
    // Carga un producto a un carrito con el id de producto
    let id = req.params.id
    let id_prod =req.params.id_prod
    productosApi.getById(id_prod)
    .then((productoNuevo)=>{
        carritosApi.getById(id)
        .then((carritoAActualizar) =>{
            let prods= carritoAActualizar[0]["items"]
            prods.push(productoNuevo[0])
            let cart_timestamp = Date.now()
            carritosApi.udpateById(id, {"items": prods, cart_timestamp})
            res.send("Carrito actualizado")
        })
        .catch((err) =>{
            res.send("El carrito requerido no existe")
        })
    })
}

export const agregarVariosItemsAlCarrito  = (req, res) =>{
    // Carga un nuevo array de productos a un carrito
    let prods = req.body
    let id = req.params.id
    let cart_timestamp = Date.now()
    carritosApi.udpateById(id, {"items": prods, cart_timestamp})
    .then((respuesta) =>{
        console.log(respuesta)
        if(respuesta === null){
            res.send(`No se encontró ningún carrito con el id ${id}`)

        }
        else{
            res.send(`Productos agregados al carrito ${id}`)
        }
    })
}

export const borrarItemDelCarrito = (req,res) =>{
    let id = req.params.id
    let id_prod = req.params.id_prod
    carritosApi.getById(id)
    .then((carrito)=>{
        let prods= carrito[0]["items"]
        let index = prods.findIndex((el) => el.id === id_prod)
        if (index === -1){
            res.send(`Error: Este producto no se encuentra en el carrito`)
            return
        }
        prods.splice(index,1)
        let cart_timestamp = Date.now()
        carritosApi.udpateById(id, {"items": prods, cart_timestamp})
        res.send("Producto eliminado")
    })
    .catch(err => {res.send(`Error: el carrito no existe - ${err}`)}) 
}