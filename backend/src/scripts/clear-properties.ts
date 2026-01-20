// Script para eliminar TODAS las propiedades de MongoDB
// Para ejecutar: npm run clear-properties

import { NestFactory } from '@nestjs/core'
import { AppModule } from '../app.module'
import { getModelToken } from '@nestjs/mongoose'
import { Property, PropertyDocument } from '../properties/schemas/property.schema'
import { Model } from 'mongoose'

async function clearProperties() {
  try {
    const app = await NestFactory.createApplicationContext(AppModule)
    
    const propertyModel = app.get<Model<PropertyDocument>>(getModelToken(Property.name))

    // Contar propiedades existentes
    const existingCount = await propertyModel.countDocuments().exec()
    console.log(`📊 Propiedades existentes en MongoDB: ${existingCount}`)

    if (existingCount === 0) {
      console.log('✅ No hay propiedades para eliminar.')
      await app.close()
      process.exit(0)
    }

    // Eliminar TODAS las propiedades
    const result = await propertyModel.deleteMany({}).exec()
    console.log(`✅ ${result.deletedCount} propiedades eliminadas de MongoDB`)
    
    // Verificar que se eliminaron
    const remainingCount = await propertyModel.countDocuments().exec()
    console.log(`📊 Propiedades restantes: ${remainingCount}`)

    if (remainingCount === 0) {
      console.log('✅ MongoDB limpiado correctamente. Ahora solo se mostrarán propiedades del XML de Inmovilla.')
    } else {
      console.warn(`⚠️  Aún quedan ${remainingCount} propiedades en MongoDB`)
    }

    await app.close()
    process.exit(0)
  } catch (error) {
    console.error('❌ Error eliminando propiedades:', error)
    process.exit(1)
  }
}

clearProperties()
