import express from 'express'
const routerAuth = express.Router()
import passport from "passport";
import { Strategy } from "passport-local";
const LocalStrategy = Strategy;
import * as model from '../models/users.js'
import bcrypt from 'bcrypt'
// import { CPU_CORES } from '../server.js';
import {enviarEmail} from '../scripts/mailer.js';

// FUNCIONES
function isAuth(req,res,next){
    if(req.isAuthenticated()){
        next()
    }
    else{
        res.redirect('/login')
    }
}

async function saveUser(user){
    const userSave = await model.usuarios.insertMany(user)
    return userSave
}


// Passport local
let usuarioActual

passport.use('local', new LocalStrategy(
    async function(username, password, done){
        const existeUsuario = await model.usuarios.findOne({email: username})
        usuarioActual = existeUsuario
        if(!existeUsuario){
            console.log('usuario no encontrado')
            return done(null, false)
        }
        else{
            const match = await verifyPass(existeUsuario, password)
            if (!match) {
                return done(null, false)
            }
            return done(null, existeUsuario);
        }
    }
))

passport.serializeUser((usuario, done) => {
    done(null, usuario);
});

passport.deserializeUser((nombre, done) => {
    model.usuarios.find({username: nombre})
    .then((res=>{
        done(null, res)
    }))
    .catch((err) =>{console.log('error desde deserializacion' + err)})
});

// RUTAS
routerAuth.use(passport.initialize())
routerAuth.use(passport.session());

routerAuth.get('/', isAuth, (req,res) =>{
    usuarioActual = req.session.passport.user
    const nombre = req.session.passport.user.username
    const email = req.session.passport.user.email
    res.render('main',  {nombre: nombre, email: email })
})

routerAuth.get('/logout', (req, res) => {
    res.render('logout', {nombre: req.session.passport.user.username})
    req.session.destroy(err=>{
        if(err){
            res.json({status: 'Error al desloggearse', body: err})
        }
    })
    
})

routerAuth.get('/login', (req, res) => {
    res.render('login')
})

routerAuth.get('/login-error', (req, res) => {
    res.render('login-error');
})

routerAuth.get('/register',(req,res)=>{
    res.render('register')
})

routerAuth.get('/datosPersonales',(req,res)=>{
    res.json(usuarioActual)
})


routerAuth.post('/register', async (req,res) =>{
    console.log(req.body)
    let{ username, email, tel, password } = req.body
    console.log(username, email, tel, password)
    const newUser = {
        username: username,
        email: email,
        tel: tel,
        password: await generateHashPassword(password)
    }
    
    saveUser(newUser)
    .then((res)=>{
        console.log(res)
        enviarEmail(newUser)
    })
    
    // req.session.nombre = nombre
    res.redirect('/login');
})

routerAuth.post(
    '/login', 
    passport.authenticate('local', {
        successRedirect:'/', 
        failureRedirect: '/login-error'
    }),
    (req, res) => {

        res.cookie('userEmail', req.session.passport.user)
    }
)

// PROCESS: Ruta info con datos del proceso
routerAuth.get('/info', (req,res)=>{
    const datos = {
        argumentos: process.argv.slice(2),
        plataforma: process.platform,
        version: process.version,
        rss: process.memoryUsage(),
        path: process.execPath,
        pid: process.pid,
        carpeta: process.cwd(),
        procesadores: CPU_CORES
    }
    console.log(datos)
    // res.json(datos)
    res.render('info', {datos})
})



// Metodos de Auth con Bcrypt
async function generateHashPassword(password) {
    const hashPassword = await bcrypt.hash(password, 10)
    return hashPassword
}

async function verifyPass(usuario, password) {
    const match = await bcrypt.compare(password, usuario.password)
    console.log(`pass login: ${password} || pass hash: ${usuario.password}`)
    console.log(match)
    return match
}

export {routerAuth, usuarioActual}