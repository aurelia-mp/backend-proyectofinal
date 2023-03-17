
import mongoose from 'mongoose'
import config from '../config.js'

await mongoose.connect(config.mongodb.cnxStr, config.mongodb.options)

class ContenedorMongoDb {
    constructor(nombreColeccion, esquema) {
        this.coleccion = mongoose.model(nombreColeccion, esquema)
    }

    async save(objeto){
        try{
            let objetoGuardado = await this.coleccion.insertMany(objeto)
            console.log(objetoGuardado)
            return objetoGuardado[0]['_id']
        }
        catch(err){
            console.log('Error al guardar el producto' + err)
        }
    }

    async getById(number){
        try{
            const registroBuscado = await this.coleccion.findById({_id: number}).lean()
            return registroBuscado ? registroBuscado 
                    : null
        }
        catch(err){console.log(err)}
    }

    async udpateById(id, cambios){
        try{
            const registroActualizado = await this.coleccion.findByIdAndUpdate({_id: id}, cambios, {new:true})   
            return registroActualizado ? registroActualizado : null
        }
        catch(err){console.log(err)}
    }

    async getAll(){
        try{
            const registros = await this.coleccion.find({}).lean() 
            // .lean transforma el objeto Mongoose en json
            console.log(registros)
            return registros
        }
        catch(error){
            console.log("error de lectura: " + error)
        }

    }
    
    async deleteById(number){
        try{
            let itemABorrar = await this.coleccion.findByIdAndDelete({_id: number})
            return itemABorrar ?  await this.coleccion.find({}) : null
        }
        catch(err){console.log('error al borrar:' + err)}
    }

    async deleteAll(){
        try{
            await this.coleccion.deleteMany({})
            console.log('Todos los registros fueron borrados')
            return
        }
        catch(err){
            console.log('Error al borrar' + err)
        }
    }
}

export default ContenedorMongoDb