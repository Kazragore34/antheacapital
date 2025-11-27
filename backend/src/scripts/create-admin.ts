// Script para crear usuario admin
// Este script debe ejecutarse manualmente después de configurar la base de datos
// Para ejecutar: npm run create-admin (después de configurar el script en package.json)

import { NestFactory } from '@nestjs/core'
import { AppModule } from '../app.module'
import { getModelToken } from '@nestjs/mongoose'
import { User, UserDocument } from '../auth/schemas/user.schema'
import * as bcrypt from 'bcrypt'
import { Model } from 'mongoose'

async function createAdmin() {
  try {
    const app = await NestFactory.createApplicationContext(AppModule)
    
    const userModel = app.get<Model<UserDocument>>(getModelToken(User.name))

    const email = process.env.ADMIN_EMAIL || 'admin@antheacapital.es'
    const password = process.env.ADMIN_PASSWORD || 'admin123'
    const name = process.env.ADMIN_NAME || 'Administrador'

    const existingUser = await userModel.findOne({ email }).exec()
    if (existingUser) {
      console.log('Usuario admin ya existe')
      await app.close()
      return
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const admin = new userModel({
      email,
      password: hashedPassword,
      name,
      role: 'admin',
    })

    await admin.save()
    console.log('Usuario admin creado exitosamente')
    console.log(`Email: ${email}`)
    console.log(`Password: ${password}`)
    console.log('IMPORTANTE: Cambie la contraseña después del primer inicio de sesión')

    await app.close()
  } catch (error) {
    console.error('Error creando usuario admin:', error)
    process.exit(1)
  }
}

createAdmin()

