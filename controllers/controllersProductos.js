import {
    productosDao as productosApi,
} from '../daos/index.js'

export const getProductos = (req,res) =>{
    productosApi.getAll()
    .then(productos=>{
        res.render('products', {productos: productos})
    })
    .catch(err=>{
        res.send(err)
    })
}

export const getProductoById = (req,res) =>{
        let id = req.params.id
        productosApi.getById(id)
        .then(resp => 
            resp ? 
                res.send(resp)
                :
                res.send({error: 'producto no encontrado'}) 
            )
}

export const borrarProductoById = (req,res) =>{
    let id=req.params.id
    productosApi.deleteById(id)
    .then(resp=>
            resp ?
                (res.send(`Producto ${id} borrado`))
                :
                res.send({error: 'producto no encontrado'}) 
        )
}

export const modificarProductoById = (req,res) =>{
    let id = req.params.id
    let timestamp= Date.now()

    let cambios = {
        ...req.body,
        timestamp:timestamp
    }
    productosApi.udpateById(id, cambios)

    .then(()=>{
        res.send(`Producto ${id} actualizado`)
    })
}

export const crearProducto = (req,res,next) =>{
    const file = req.file
    let thumbnail

    if(!file) {
        const error = new Error('Error subiendo el archivo')
        error.httpStatusCode = 400
        // se comenta el return para poder guardar registros via postman, sin subir la imagen
        // return next(error)
        console.log('Error al subir el archivo, producto guardado sin imagen' + error)
        thumbnail = "none"
    }
    
    const timestamp = Date.now()

    // Se agrega esta línea para evitar errores si no se posteó una imagen
    thumbnail !== "none" && (thumbnail = `/upload/${file.originalname}`)

    let producto = {
        ...req.body,
        thumbnail: thumbnail,
        timestamp: timestamp
    }

    if(!req.body.nombre || !req.body.precio) {
        const error = new Error('Faltan campos obligarios')
        error.httpStatusCode = 400
        return next(error)
    }
    productosApi.save(producto)

    .then(() =>{
        console.log('Producto guardado')
        productosApi.getAll()
        .then((listaProductos) =>{
            res.render('main', {listaProductos})
        })
    })
}

export const borrarTodos = (req, res)=>{
    productosApi.deleteAll()
    .then(()=>{
        res.send("Se borraron todos los productos")
    })
}