import twilio from 'twilio'
import dotenv from 'dotenv'
dotenv.config()

// Configuración de Twilio 
// SID Y TOKEN con variables de entorno
// Los datos se encuentran en el dashboard de Twilio
const accountSid = process.env.TWILIO_ACCOUNT_SID
// const accountSid ="ACbc72478c7eb5a5c66615ab591496474b"
// const authToken="aee77d0d4ee3aa54b0c3f30b4601beed"
const authToken = process.env.TWILIO_AUTH_TOKEN

// Inicializamos Twilio
const client = twilio(accountSid, authToken)

export default async function enviarWA(numero){
    console.log(numero)
    const options = {
        // cuerpo del mensaje
        body: 'Su pedido ha sido recibido y está en proceso de preparación',
        from: 'whatsapp:+14155238886', // Número de Twilio - lo encontramos en el Sandbox
        //to:'whatsapp:+5491169458370',
        to: `whatsapp:${numero}`
    }
    try{
        await client.messages.create(options)
    }
    catch(err){
        console.log(err)
    }
}
