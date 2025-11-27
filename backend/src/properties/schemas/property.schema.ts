import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

export type PropertyDocument = Property & Document

@Schema({ timestamps: true })
export class Property {
  @Prop({ required: true })
  title: string

  @Prop({ required: true })
  description: string

  @Prop({ required: true, enum: ['venta', 'alquiler'] })
  type: string

  @Prop({ required: true })
  price: number

  @Prop({ type: Object, required: true })
  location: {
    address: string
    city: string
    province: string
    coordinates?: [number, number]
  }

  @Prop({ type: Object, required: true })
  features: {
    bedrooms: number
    bathrooms: number
    area: number
    floor?: number
    parking?: boolean
    elevator?: boolean
    terrace?: boolean
    garden?: boolean
    pool?: boolean
    furnished?: boolean
  }

  @Prop({ type: [String], default: [] })
  images: string[]

  @Prop({ enum: ['published', 'draft'], default: 'draft' })
  status: string
}

export const PropertySchema = SchemaFactory.createForClass(Property)

