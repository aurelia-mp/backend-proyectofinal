import { resolveInclude } from "ejs";
import admin from "firebase-admin"
import config from '../config.js'

admin.initializeApp({
    credential: admin.credential.cert(config.firebase)
})

const db = admin.firestore();

class ContenedorFirebase{
    constructor(nombreColeccion) {
        this.coleccion = db.collection(nombreColeccion)
    }

    async save(objeto){
        try{
            let id = 1
            const cantidadRegistros = await this.coleccion.count().get()
            if(cantidadRegistros.data().count > 0){
                id = (cantidadRegistros.data().count) +1
            }          
            let nuevoDoc= this.coleccion.doc(`${id}`)
            objeto={
                ...objeto,
                id: id
            }
            await nuevoDoc.create(objeto)
            return id
        }
        catch(err){
            console.log('Error al guardar el producto' + err)
        }
    }

    async getById(number){
        try{
            number = parseInt(number)
            const doc = this.coleccion.doc(`${number}`)
            let registro = await doc.get()
            // Transforma la respuesta en un array para que funcione el método getCarrito
            let arrayRespuesta = []
            arrayRespuesta.push(registro.data())
            return registro? arrayRespuesta : null 
        }
        catch(err){console.log(err)}
    }

    async udpateById(id, cambios){
        try{
            const doc = this.coleccion.doc(id)
            console.log(cambios)
            let registro = await doc.update(cambios)
            let registroActualizado = await doc.get()
            return registro ? registroActualizado.data() : null
        }
        catch(err){console.log(err)}
    }

    async getAll(){
        try{
            const read = await this.coleccion.get()
            const registros = read.docs
            const registrosFormateados = registros.map((registro) => ({
                id: registro.id,
                ...registro.data()
            }))
            console.log(registrosFormateados)
            return registrosFormateados
        }
        catch(error){
            console.log("error de lectura: " + error)
        }

    }

    async deleteById(number){
        try{
            const doc = this.coleccion.doc(number)
            let docBorrado = await doc.delete()
            return docBorrado ? docBorrado  : null
        }
        catch(err){console.log('error al borrar:' + err)}
    }

    async deleteAll(){
        try{

            // Desde documentación de firebase
            const registros = await this.coleccion.get()

            const batchSize = registros.size
            if (batchSize === 0){
                resolveInclude()
                return
            }

            const batch = db.batch()
            registros.docs.forEach((doc)=>{
                batch.delete(doc.ref)
            })
            await batch.commit()
            return
        }
        catch(err){
            console.log('Error al borrar' + err)
        }
    }
}

export default ContenedorFirebase