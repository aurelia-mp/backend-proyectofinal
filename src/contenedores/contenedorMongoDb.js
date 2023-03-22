import mongoose from 'mongoose'
import config from '../config.js'
import CustomError from '../clases/CustomError.class.js'
import MongoDBClient from '../clases/MongoDBClient.class.js'
import {logInfo, logWarn, logError} from '../../scripts/loggers/loggers.js'

// NO FUNCIONA EL CONNECT - SE TILDA TODO SI COMENTO LA LÍNEA SIGUIENTE
// await mongoose.connect(config.mongodb.cnxStr, config.mongodb.options)

class ContenedorMongoDb {
    constructor(nombreColeccion, esquema) {
        this.coleccion = mongoose.model(nombreColeccion, esquema)
        this.connexion = new MongoDBClient()
    }

    async save(objeto){
        try{
            this.connexion.connect()

            let objetoGuardado = await this.coleccion.insertMany(objeto)
            console.log(objetoGuardado)
            return objetoGuardado[0]['_id']
        }
        catch(err){
            console.log('Error al guardar el producto' + err)
        } finally {
            this.connexion.disconnect()
        }
    }

    async getById(number){
        try{
            this.connexion.connect()

            const registroBuscado = await this.coleccion.findById({_id: number}).lean()
            return registroBuscado ? registroBuscado 
                    : null
        } catch(err){
            console.log(err)
        } finally {
            this.connexion.disconnect()
        }
    }

    async udpateById(id, cambios){
        try{
            this.connexion.connect()
            
            const registroActualizado = await this.coleccion.findByIdAndUpdate({_id: id}, cambios, {new:true})   
            return registroActualizado ? registroActualizado : null
        } catch(err){
            console.log(err)
        } finally {
            this.connexion.disconnect()
        }
    }

    async getAll(){
        try{
            this.connexion.connect()

            const registros = await this.coleccion.find({}).lean() 
            // .lean transforma el objeto Mongoose en json
            console.log(registros)
            return registros
        } catch(error){
            console.log("error de lectura: " + error)
        } finally {
            this.connexion.disconnect()
        }

    }
    
    async deleteById(number){
        try{
            this.connexion.connect()

            let itemABorrar = await this.coleccion.findByIdAndDelete({_id: number})
            return itemABorrar ?  await this.coleccion.find({}) : null
        } catch(err){
            console.log('error al borrar:' + err)
        } finally {
            this.connexion.disconnect()
        }
    }

    async deleteAll(){
        try{
            this.connexion.connect()

            await this.coleccion.deleteMany({})
            console.log('Todos los registros fueron borrados')
            return
        }
        catch(err){
            console.log('Error al borrar' + err)
        } finally {
            this.connexion.disconnect()
        }
    }
}

export default ContenedorMongoDb