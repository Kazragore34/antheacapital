import { IsString, IsEmail, IsOptional, IsBoolean } from 'class-validator'

export class ContactDto {
  @IsString()
  name: string

  @IsString()
  surname: string

  @IsEmail()
  email: string

  @IsString()
  phone: string

  @IsString()
  message: string

  @IsOptional()
  @IsString()
  propertyId?: string

  @IsOptional()
  @IsString()
  propertyTitle?: string

  @IsOptional()
  @IsString()
  propertyUrl?: string

  @IsOptional()
  @IsString()
  propertyPrice?: string

  @IsOptional()
  @IsString()
  propertyType?: string

  @IsBoolean()
  consent: boolean

  @IsOptional()
  @IsBoolean()
  marketing?: boolean
}

export class ValuationDto {
  @IsString()
  address: string

  @IsString()
  type: string

  @IsString()
  area: string

  @IsString()
  bedrooms: string

  @IsString()
  state: string

  @IsString()
  name: string

  @IsEmail()
  email: string

  @IsString()
  phone: string

  @IsBoolean()
  consent: boolean

  @IsOptional()
  @IsBoolean()
  marketing?: boolean
}

