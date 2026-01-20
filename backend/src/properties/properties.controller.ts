import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common'
import { PropertiesService } from './properties.service'
import { CreatePropertyDto } from './dto/create-property.dto'
import { UpdatePropertyDto } from './dto/update-property.dto'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'

@Controller('properties')
export class PropertiesController {
  constructor(private readonly propertiesService: PropertiesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createPropertyDto: CreatePropertyDto) {
    return this.propertiesService.create(createPropertyDto)
  }

  @Get()
  findAll(
    @Query('type') type?: string,
    @Query('city') city?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('bedrooms') bedrooms?: string,
    @Query('minArea') minArea?: string,
    @Query('status') status?: string,
  ) {
    return this.propertiesService.findAll({
      type,
      city,
      minPrice: minPrice ? parseInt(minPrice) : undefined,
      maxPrice: maxPrice ? parseInt(maxPrice) : undefined,
      bedrooms: bedrooms ? parseInt(bedrooms) : undefined,
      minArea: minArea ? parseInt(minArea) : undefined,
      status,
    })
  }

  @Get('by-cod/:codOfer')
  async findByCodOfer(@Param('codOfer') codOfer: string) {
    const property = await this.propertiesService.findByCodOfer(codOfer)
    if (!property) {
      throw new NotFoundException(`Property with codOfer ${codOfer} not found`)
    }
    return property
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.propertiesService.findOne(id)
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updatePropertyDto: UpdatePropertyDto) {
    return this.propertiesService.update(id, updatePropertyDto)
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.propertiesService.remove(id)
  }

  @Delete()
  @UseGuards(JwtAuthGuard)
  deleteAll() {
    return this.propertiesService.deleteAll()
  }
}

