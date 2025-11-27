import { IsString, IsNumber, IsEnum, IsObject, IsArray, IsOptional, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'

class LocationDto {
  @IsString()
  address: string

  @IsString()
  city: string

  @IsString()
  province: string

  @IsOptional()
  @IsArray()
  coordinates?: [number, number]
}

class FeaturesDto {
  @IsNumber()
  bedrooms: number

  @IsNumber()
  bathrooms: number

  @IsNumber()
  area: number

  @IsOptional()
  @IsNumber()
  floor?: number

  @IsOptional()
  parking?: boolean

  @IsOptional()
  elevator?: boolean

  @IsOptional()
  terrace?: boolean

  @IsOptional()
  garden?: boolean

  @IsOptional()
  pool?: boolean

  @IsOptional()
  furnished?: boolean
}

export class CreatePropertyDto {
  @IsString()
  title: string

  @IsString()
  description: string

  @IsEnum(['venta', 'alquiler'])
  type: string

  @IsNumber()
  price: number

  @ValidateNested()
  @Type(() => LocationDto)
  location: LocationDto

  @ValidateNested()
  @Type(() => FeaturesDto)
  features: FeaturesDto

  @IsArray()
  @IsString({ each: true })
  images: string[]

  @IsOptional()
  @IsEnum(['published', 'draft'])
  status?: string
}

