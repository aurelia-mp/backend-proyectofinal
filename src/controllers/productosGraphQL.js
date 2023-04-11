import {
    productosDao as productosApi,
} from '../daos/index.js'

export const getProductos = async () =>{
    const productos = await productosApi.getAll()
    return productos
}

export const getProductoById = async ({id}) =>{
    const producto = await productosApi.getById(id)

    if (!producto) {
        throw new Error ('Producto no encontrado')
    }
    else return producto
}

export const borrarProductoById = async ({id}) => {
    const producto = await productosApi.deleteById(id)
    if (!producto) {
        throw new Error ('Producto no encontrado')
    }
    else return producto
}

export const modificarProductoById = async ({id, datos}) =>{
    const productoActualizado = await productosApi.udpateById(id, datos)
    if (!productoActualizado) {
        throw new Error ('Producto no encontrado')
    }
    else return productoActualizado
}

export const crearProducto = async ({datos}) =>{
    const idNuevo = await productosApi.save(datos)
    return idNuevo
}
