import ContenedorMongoDb from "../contenedores/contenedorMongoDb.js"

class UsersMongoDb extends ContenedorMongoDb {

    constructor() {
        super('usuarios', {
            username: {type: String, required: true},
            email: {type: String, required: true},
            tel: {type: String, required: false},
            password: {type: String, required: true}
        })
    }
}

export default UsersMongoDb


