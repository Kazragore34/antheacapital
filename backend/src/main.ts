import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  
  // CORS
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  })
  
  // Global prefix
  app.setGlobalPrefix('api')
  
  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  )
  
  const port = process.env.PORT || 3001
  await app.listen(port, '0.0.0.0') // Escuchar en todas las interfaces para Hostinger
  console.log(`🚀 Backend running on http://0.0.0.0:${port}`)
  console.log(`📡 API available at http://localhost:${port}/api`)
  console.log(`🔍 Debug endpoint: http://localhost:${port}/api/properties/debug`)
}
bootstrap()

