import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'
import { PropertiesModule } from './properties/properties.module'
import { AuthModule } from './auth/auth.module'
import { AdminModule } from './admin/admin.module'
import { UploadModule } from './upload/upload.module'
import { ContactModule } from './contact/contact.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.DATABASE_URL || 'mongodb://localhost:27017/anthea-capital'),
    PropertiesModule,
    AuthModule,
    AdminModule,
    UploadModule,
    ContactModule,
  ],
})
export class AppModule {}

