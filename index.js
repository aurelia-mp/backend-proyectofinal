import express from "express";
import session from 'express-session'
import routerProductos from "./routers/routerProductos.js";
import routerCarrito from "./routers/routerCarrito.js";
import {routerAuth} from "./routers/routerAuth.js";
import handlebars from 'express-handlebars'
import config from './config.js'
import { logInfo, logWarn } from './scripts/loggers/loggers.js'
import cluster from 'cluster'
import os from 'os'

import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express()

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

//Loggeo de todas las peticiones

app.use((req, res, next) =>{
    logInfo(`${req.method} ${req.url}`)
    next()
})

// Routers
app.use('/api/productos', routerProductos)
app.use('/api/carritos', routerCarrito)
app.use('/', routerAuth)

// Loggeo de rutas inexistentes

app.use('*', (req, res, next) => {
    logWarn(`ruta ${req.originalUrl} método ${req.method} no implementada`)
    next()
})

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

// CLUSTER
export const CPU_CORES = os.cpus().length
if (config.mode == 'CLUSTER' && cluster.isPrimary) {
    console.log('Cantidad de cores: ', CPU_CORES)
    
    for (let i = 0; i < CPU_CORES; i++) {
        cluster.fork()
    }
    
    cluster.on('exit', worker => {
        console.log(`Worker finalizó proceso ${process.pid} ${worker.id} ${worker.pid} finalizó el ${new Date().toLocaleString}`)
        cluster.fork()
    })
} else {
    const server = app.listen(config.PORT, err => {
        if (!err) console.log(`Servidor http escuchando en el puerto ${config.PORT} - PID: ${process.pid}`)
    })
    server.on('error', error => {
        console.log(`Error en servidor ${error}`)
        logError(error)    
    })
}