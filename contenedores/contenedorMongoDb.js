import mongoose, { model } from 'mongoose'
import config from '../config.js'

await mongoose.connect(config.mongodb.cnxStr, config.mongodb.options)

class ContenedorMongoDb {
    constructor(nombreColeccion, esquema) {
        this.coleccion = mongoose.model(nombreColeccion, esquema)
    }

    async save(objeto){
        try{
            return await this.coleccion.insertMany(objeto)
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

    // async getIndexById(number){
    //     try{
    //         const dataFormateada= JSON.parse(await fs.readFile(this.path, 'utf-8'))
    //         const index = dataFormateada.findIndex((elem) => elem.id===number)
    //         if (index != -1) return index
    //         else return null
    //     }
    //     catch(err){console.log(err)}
    // }

    async udpateById(id, cambios){
        try{
            const registroActualizado = await this.coleccion.findByIdAndUpdate({_id: id}, cambios, {new:true})   
            return registroActualizado ? registroActualizado : null
        }
        catch(err){console.log(err)}
    }

    async getAll(){
        try{
            const prods = await this.coleccion.find({}).lean() 
            // .lean transforma el objeto Mongoose en json
            console.log(prods)
            return prods
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