import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Property, PropertyDocument } from './schemas/property.schema'
import { CreatePropertyDto } from './dto/create-property.dto'
import { UpdatePropertyDto } from './dto/update-property.dto'

@Injectable()
export class PropertiesService {
  constructor(
    @InjectModel(Property.name) private propertyModel: Model<PropertyDocument>,
  ) {}

  async create(createPropertyDto: CreatePropertyDto): Promise<Property> {
    const createdProperty = new this.propertyModel(createPropertyDto)
    return createdProperty.save()
  }

  async findAll(query: {
    type?: string
    city?: string
    minPrice?: number
    maxPrice?: number
    bedrooms?: number
    minArea?: number
    status?: string
  }): Promise<Property[]> {
    try {
      const filter: any = {}
      
      if (query.status) {
        filter.status = query.status
      } else {
        filter.status = 'published'
      }
      
      if (query.type) filter.type = query.type
      if (query.city) filter['location.city'] = new RegExp(query.city, 'i')
      if (query.minPrice || query.maxPrice) {
        filter.price = {}
        if (query.minPrice) filter.price.$gte = query.minPrice
        if (query.maxPrice) filter.price.$lte = query.maxPrice
      }
      if (query.bedrooms) filter['features.bedrooms'] = query.bedrooms
      if (query.minArea) filter['features.area'] = { $gte: query.minArea }

      const properties = await this.propertyModel.find(filter).sort({ createdAt: -1 }).exec()
      // Asegurar que siempre devolvemos un array
      return Array.isArray(properties) ? properties : []
    } catch (error) {
      console.error('Error fetching properties:', error)
      // Devolver array vacío en caso de error
      return []
    }
  }

  async findOne(id: string): Promise<Property> {
    const property = await this.propertyModel.findById(id).exec()
    if (!property) {
      throw new NotFoundException(`Property with ID ${id} not found`)
    }
    return property
  }

  async update(id: string, updatePropertyDto: UpdatePropertyDto): Promise<Property> {
    const property = await this.propertyModel
      .findByIdAndUpdate(id, updatePropertyDto, { new: true })
      .exec()
    if (!property) {
      throw new NotFoundException(`Property with ID ${id} not found`)
    }
    return property
  }

  async remove(id: string): Promise<void> {
    const result = await this.propertyModel.findByIdAndDelete(id).exec()
    if (!result) {
      throw new NotFoundException(`Property with ID ${id} not found`)
    }
  }
}

