import Contenedor from '../contenedores/class.js'

// const Contenedor = require('../contenedores/class')
export const productos = new Contenedor('./db/productos.json')

export const getProductos = (req,res) =>{
    productos.getAll()
    .then(productos=>{
        res.render('products', {productos: productos})
    })
    .catch(err=>{
        res.send(err)
    })
}

export const getProductoById = (req,res) =>{
        let id = parseInt(req.params.id)
        productos.getById(id)
        .then(resp => 
            resp ? 
                res.send(resp)
                :
                res.send({error: 'producto no encontrado'}) 
            )
}

export const borrarProductoById = (req,res) =>{
    let id=parseInt(req.params.id)
    productos.deleteById(id)
    .then(resp=>
            resp ?
                (res.send(`Producto ${id} borrado`))
                :
                res.send({error: 'producto no encontrado'}) 
        )
}

export const modificarProductoById = (req,res) =>{
    let id = parseInt(req.params.id)
    let timestamp= Date.now()

    let cambios = {
        ...req.body,
        timestamp:timestamp
    }
    productos.udpateById(id, cambios)

    .then(resp=>{
        res.send(`Producto ${id} actualizado`)
    })
}

export const crearProducto = (req,res,next) =>{
    const file = req.file

    if(!file) {
        const error = new Error('Error subiendo el archivo')
        error.httpStatusCode = 400
        return next(error)
    }
    
    const timestamp = Date.now()

    let producto = {
        ...req.body,
        thumbnail: `/upload/${file.originalname}`,
        timestamp: timestamp
    }

    if(!req.body.nombre || !req.body.precio) {
        const error = new Error('Faltan campos obligarios')
        error.httpStatusCode = 400
        return next(error)
    }
    productos.save(producto)

    .then(() =>{
        console.log('Producto guardado')
        productos.getAll()
        .then((listaProductos) =>{
            res.render('main', {listaProductos})
        })
    })
}