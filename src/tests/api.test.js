// TESTEAR RESPUESTA A LECTURA, INCORPORACION, MODIFICACION Y BORRADO DE PRODUCTOS
import supertest from 'supertest'
import { expect } from 'chai'

import app from '../../index.js'

let request
let server
let idNuevo
const nuevoVino = {
    nombre: "Segundo vino de prueba desde Mocha",
    descripcion: "Prueba",
    codigo: 123456,
    precio: 1000,
    thumbnail: "upload/item1.jpg",
    stock: 100
}


// 1er test - LECTURA PRODUCTOS
describe('Test a API', () => {

    before(async function () {
        server = await startServer()
        request = supertest(`http://localhost:${server.address().port}/api/productos`)
    })

    after(function () {
        server.close()
    })

    describe('Lectura de productos', () => {
        it('La petición Get retorna un status 200', async () => {
            const response = await request.get('/')
            expect(response.status).to.eql(200)
        })

        it('La petición Get un array de productos', async () => {
            const response = await request.get('/')
            const products = response.body
            expect(products).to.be.an('array')
        })
    })


    describe('Incorporación de producto (POST)', () => {
        it('La petición POST retorna un status 200 ', async () => {
            const response = await request.post('/').send(nuevoVino)
            expect(response.status).to.eql(200)
            // Guarda el ID del producto incorporado para las siguientes pruebas
            idNuevo= response.body.idNuevo
        })

        it('La petición POST suma un producto', async () => {
            const peticionInicial = await request.get('/')
            const cantidadInicialProductos = peticionInicial.body.length
            
            const response = await request.post('/').send(nuevoVino)
            expect(response.body.prodsActualizados.length).to.eql(cantidadInicialProductos+1)
        })
    })

    describe('Lectura de un producto específico', () => {
        it('La petición Get by id retorna un status 200', async () => {
            const response = await request.get(`/producto/${idNuevo}`)
            expect(response.status).to.eql(200)

            const products = response.body
            expect(products).to.include.keys('nombre', 'descripcion', 'codigo', 'precio', 'stock', 'thumbnail')
        })

        it('La petición Get by id retorna un producto', async () => {
            const response = await request.get(`/producto/${idNuevo}`)
            const products = response.body
            expect(products).to.include.keys('nombre', 'descripcion', 'codigo', 'precio', 'stock', 'thumbnail')
        })

    })

    describe('Actualizacion de producto (PUT)', () => {
        it('La petición PUT retorna un status 200', async () => {            
            let cambios = {
                nombre:"Titulo modificado"
            }
            const actualizacion = await request.put(`/producto/${idNuevo}`).send(cambios)
            expect(actualizacion.text).to.eql(`Producto ${idNuevo} actualizado`)

            expect(actualizacion.status).to.eql(200)

            let nuevaLectura = await request.get(`/producto/${idNuevo}`)
            const products = nuevaLectura.body
            console.log(products.nombre)
            expect(products.nombre).to.eql("Titulo modificado")
        })
    })


    describe('Borrado de producto (DELETE)', () => {
        it('La petición DELETE retorna un status 200 y borra un producto', async () => {
            const borrado = await request.del(`/producto/${idNuevo}`)
            expect(borrado.text).to.eql(`Producto ${idNuevo} borrado`)

            expect(borrado.status).to.eql(200)
        })
    })
})

async function startServer() {
    return new Promise((resolve, reject) => {
        const PORT = 8091
        const server = app.listen(PORT, () => {
            console.log(`Servidor express escuchando en el puerto ${server.address().port}`);
            resolve(server)
        });
        server.on('error', error => {
            console.log(`Error en Servidor: ${error}`)
            reject(error)
        });
    })
}