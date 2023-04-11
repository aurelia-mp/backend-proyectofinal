import {
    getProductos,
    getProductoById,
    borrarProductoById,
    modificarProductoById,
    crearProducto
} from './productosGraphQL.js'

import {graphqlHTTP} from 'express-graphql'
import {buildSchema} from 'graphql'

const productoSchema = buildSchema(`
  type Producto {
    _id: ID!
    nombre: String,
    descripcion: String,
    codigo: Float,
    precio: Float,
    stock: Float,
  }
  input ProductoInput {
    nombre: String,
    descripcion: String,
    codigo: Float,
    precio: Float,
    stock: Float,
  }
  type Query {
    getProductos: [Producto],
    getProductoById(id: ID!): Producto,
  }
  type Mutation {
    crearProducto(datos: ProductoInput): Producto,
    modificarProductoById(id: ID!, datos: ProductoInput): Producto,
    borrarProductoById(id: ID!): Producto
  }
`)


export default class GraphQLController {
    constructor() {
        return graphqlHTTP({
            schema: productoSchema,
            rootValue: {
                getProductos: getProductos,
                getProductoById: getProductoById,
                crearProducto: crearProducto,
                modificarProductoById: modificarProductoById,
                borrarProductoById: borrarProductoById
            },
            graphiql: true,
        })
    }
}