import 'dotenv/config'
import axios from 'axios'
import nodemailer from 'nodemailer'

// Configuración simple de correo
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
})

// Función para enviar correo
async function enviarCorreo(mensaje: string) {
  try {
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: process.env.NOTIFY_EMAIL_TO,
      subject: 'Envio de correo',
      text: mensaje
    })
    console.log(' Correo enviado')
  } catch (err) {
    console.error(' Error enviando correo:', err)
  }
}

// Función principal del cron
async function ejecutarCron() {
  console.log(' Ejecutando cron...')
  
  try {
    // Hacer petición que va a fallar
    await axios.get('https://httpbin.org/status/500', { timeout: 5000 })
    console.log(' Petición exitosa')
  } catch (error: any) {
    console.log(' Error en petición:', error.message)
    await enviarCorreo(`Error: ${error.message}`)
  }
}

// Ejecutar cada 10 segundos
import cron from 'node-cron'
cron.schedule(' */10 * * * * *', ejecutarCron)

console.log(' Cron iniciado - cada 10 segundos')
