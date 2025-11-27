import { NestFactory } from '@nestjs/core'
import { AppModule } from '../app.module'
import { Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'
import { User, UserDocument } from '../auth/schemas/user.schema'
import * as bcrypt from 'bcrypt'

async function createAdmin() {
  const app = await NestFactory.createApplicationContext(AppModule)
  
  const userModel = app.get<Model<UserDocument>>('UserModel') || 
    (await import('mongoose')).model('User', require('../auth/schemas/user.schema').UserSchema)

  const email = process.env.ADMIN_EMAIL || 'admin@antheacapital.es'
  const password = process.env.ADMIN_PASSWORD || 'admin123'
  const name = process.env.ADMIN_NAME || 'Administrador'

  const existingUser = await userModel.findOne({ email })
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
}

createAdmin()

