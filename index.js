import express from "express";
import session from 'express-session'
import routerProductos from "./routers/routerProductos.js";
import routerCarrito from "./routers/routerCarrito.js";
import {routerAuth} from "./routers/routerAuth.js";
import handlebars from 'express-handlebars'
import config from './config.js'
import mongoose from "mongoose";

import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express()

const PORT = process.env.PORT || 8090

// Middleware
app.use(express.json())
app.use(express.urlencoded({extended: true}))
// Session
app.use(session(config.session))

// Mongo DB
// const URL = 'mongodb://localhost:27017/usuarios'
// mongoose.set('strictQuery', true)
// const advancedOptions = {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// }
// await mongoose.connect(URL, advancedOptions)

// Routers
app.use('/api/productos', routerProductos)
app.use('/api/carritos', routerCarrito)
app.use('/', routerAuth)

//  Archivos estáticos
app.use('/upload', express.static('upload'))
app.use(express.static('public'))

// Configuración Handlebars
app.engine('hbs', 
    handlebars({
        extname: '.hbs',
        defaultLayout: 'index.hbs',
        layoutsDir:__dirname+'/views/layouts',
        partialsDir: __dirname+'/views/partials'
    }))

app.set('views', './views')
app.set('view engine', 'hbs')

// Ruta raíz
app.get('', (req, res)=>{
    res.render('main')
})

app.get('*', ((req, res) => {
    res.send({ status: "error: -2", description: `ruta ${req.url} método ${req.method} no implementada` });
}))

const server = app.listen(PORT, () =>{
    console.log(`Servidor OK en puerto ${PORT}`)
})
server.on('error', error => console.log(`Error en servidor ${error}`))