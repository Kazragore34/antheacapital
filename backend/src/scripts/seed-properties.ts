// Script para crear propiedades de ejemplo
// Para ejecutar: npm run seed-properties (después de configurar el script en package.json)

import { NestFactory } from '@nestjs/core'
import { AppModule } from '../app.module'
import { getModelToken } from '@nestjs/mongoose'
import { Property, PropertyDocument } from '../properties/schemas/property.schema'
import { Model } from 'mongoose'

const sampleProperties = [
  {
    title: 'Elegante Piso en el Centro de Aranjuez',
    description: 'Hermoso piso completamente reformado en el corazón de Aranjuez. Ubicado en una zona tranquila pero céntrica, con excelentes comunicaciones. La vivienda cuenta con amplias estancias, mucha luz natural y acabados de alta calidad. Perfecto para familias que buscan comodidad y elegancia.',
    type: 'venta',
    price: 285000,
    location: {
      address: 'Calle de la Reina, 15',
      city: 'Aranjuez',
      province: 'Madrid',
      coordinates: [40.0311, -3.6025],
    },
    features: {
      bedrooms: 3,
      bathrooms: 2,
      area: 120,
      floor: 2,
      parking: true,
      elevator: true,
      terrace: true,
      garden: false,
      pool: false,
      furnished: false,
    },
    images: [
      'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1200',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1200',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200',
    ],
    status: 'published',
  },
  {
    title: 'Chalet Independiente con Jardín y Piscina',
    description: 'Magnífico chalet independiente en una de las mejores zonas de Aranjuez. La propiedad cuenta con amplio jardín privado, piscina, y garaje para dos vehículos. Interior completamente reformado con diseño moderno y funcional. Ideal para disfrutar del buen tiempo y la tranquilidad.',
    type: 'venta',
    price: 450000,
    location: {
      address: 'Avenida de la Paz, 42',
      city: 'Aranjuez',
      province: 'Madrid',
      coordinates: [40.0289, -3.6050],
    },
    features: {
      bedrooms: 4,
      bathrooms: 3,
      area: 250,
      floor: 0,
      parking: true,
      elevator: false,
      terrace: true,
      garden: true,
      pool: true,
      furnished: false,
    },
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200',
      'https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=1200',
    ],
    status: 'published',
  },
  {
    title: 'Apartamento Moderno en Alquiler',
    description: 'Acogedor apartamento completamente amueblado, ideal para profesionales o parejas. Ubicado en zona residencial con todos los servicios cerca. La vivienda está en perfecto estado, con calefacción central y aire acondicionado. Incluye plaza de garaje.',
    type: 'alquiler',
    price: 850,
    location: {
      address: 'Calle de la Princesa, 8',
      city: 'Aranjuez',
      province: 'Madrid',
      coordinates: [40.0330, -3.6000],
    },
    features: {
      bedrooms: 2,
      bathrooms: 1,
      area: 75,
      floor: 3,
      parking: true,
      elevator: true,
      terrace: false,
      garden: false,
      pool: false,
      furnished: true,
    },
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1200',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200',
    ],
    status: 'published',
  },
  {
    title: 'Ático con Terraza Panorámica',
    description: 'Exclusivo ático con terraza privada de 50m² con vistas espectaculares. La vivienda ha sido completamente renovada con materiales de primera calidad. Cuenta con amplias estancias, mucha luminosidad y acabados premium. Incluye plaza de garaje y trastero.',
    type: 'venta',
    price: 320000,
    location: {
      address: 'Calle de la Infanta, 25',
      city: 'Aranjuez',
      province: 'Madrid',
      coordinates: [40.0300, -3.6030],
    },
    features: {
      bedrooms: 3,
      bathrooms: 2,
      area: 110,
      floor: 5,
      parking: true,
      elevator: true,
      terrace: true,
      garden: false,
      pool: false,
      furnished: false,
    },
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1200',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200',
      'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1200',
    ],
    status: 'published',
  },
  {
    title: 'Estudio Amueblado en Zona Céntrica',
    description: 'Estudio completamente amueblado y equipado, perfecto para estudiantes o profesionales. Ubicado en el centro de Aranjuez, a pocos minutos a pie de todos los servicios. La vivienda está en perfecto estado y lista para entrar a vivir.',
    type: 'alquiler',
    price: 550,
    location: {
      address: 'Calle de San Antonio, 12',
      city: 'Aranjuez',
      province: 'Madrid',
      coordinates: [40.0320, -3.6015],
    },
    features: {
      bedrooms: 1,
      bathrooms: 1,
      area: 40,
      floor: 1,
      parking: false,
      elevator: false,
      terrace: false,
      garden: false,
      pool: false,
      furnished: true,
    },
    images: [
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1200',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200',
    ],
    status: 'published',
  },
  {
    title: 'Casa Adosada con Jardín Privado',
    description: 'Encantadora casa adosada en urbanización tranquila. La propiedad cuenta con jardín privado, garaje y trastero. Interior acogedor y funcional, con calefacción y aire acondicionado. Zona residencial muy tranquila, ideal para familias.',
    type: 'venta',
    price: 275000,
    location: {
      address: 'Calle de los Jardines, 18',
      city: 'Aranjuez',
      province: 'Madrid',
      coordinates: [40.0270, -3.6070],
    },
    features: {
      bedrooms: 3,
      bathrooms: 2,
      area: 140,
      floor: 0,
      parking: true,
      elevator: false,
      terrace: true,
      garden: true,
      pool: false,
      furnished: false,
    },
    images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200',
      'https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=1200',
    ],
    status: 'published',
  },
]

async function seedProperties() {
  try {
    const app = await NestFactory.createApplicationContext(AppModule)
    
    const propertyModel = app.get<Model<PropertyDocument>>(getModelToken(Property.name))

    // Verificar si ya existen propiedades
    const existingCount = await propertyModel.countDocuments().exec()
    if (existingCount > 0) {
      console.log(`Ya existen ${existingCount} propiedades en la base de datos.`)
      console.log('¿Desea continuar y agregar más? (S/N)')
      // En producción, puedes agregar lógica para preguntar o usar un flag
    }

    // Insertar propiedades de ejemplo
    const created = await propertyModel.insertMany(sampleProperties)
    console.log(`✅ ${created.length} propiedades de ejemplo creadas exitosamente`)
    
    // Mostrar resumen
    const total = await propertyModel.countDocuments().exec()
    const venta = await propertyModel.countDocuments({ type: 'venta' }).exec()
    const alquiler = await propertyModel.countDocuments({ type: 'alquiler' }).exec()
    
    console.log('\n📊 Resumen:')
    console.log(`   Total propiedades: ${total}`)
    console.log(`   En venta: ${venta}`)
    console.log(`   En alquiler: ${alquiler}`)

    await app.close()
    process.exit(0)
  } catch (error) {
    console.error('❌ Error creando propiedades de ejemplo:', error)
    process.exit(1)
  }
}

seedProperties()

