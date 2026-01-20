import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Property, PropertyDocument } from './schemas/property.schema'
import { CreatePropertyDto } from './dto/create-property.dto'
import { UpdatePropertyDto } from './dto/update-property.dto'
import * as xml2js from 'xml2js'
import * as https from 'https'
import * as http from 'http'
import * as fs from 'fs'
import * as path from 'path'

@Injectable()
export class PropertiesService {
  private xmlCache: Property[] | null = null
  private xmlCacheTime: number = 0
  private readonly CACHE_DURATION = 300000 // 5 minutos en milisegundos (reducido para testing)
  private readonly XML_URL = process.env.INMOVILLA_XML_URL || 'https://procesos.inmovilla.com/xml/xml2demo/2-web.xml'
  private readonly XML_LOCAL_PATH = process.env.INMOVILLA_XML_PATH || path.join(process.cwd(), 'archivos en bruto', 'listado.xml')
  private readonly INMOVILLA_NUMAGENCIA = process.env.INMOVILLA_NUMAGENCIA || '2'
  private readonly INMOVILLA_PASSWORD = process.env.INMOVILLA_PASSWORD || '82ku9xz2aw3'

  constructor(
    @InjectModel(Property.name) private propertyModel: Model<PropertyDocument>,
  ) {}

  async create(createPropertyDto: CreatePropertyDto): Promise<Property> {
    const createdProperty = new this.propertyModel(createPropertyDto)
    return createdProperty.save()
  }

  async deleteAll(): Promise<{ deletedCount: number }> {
    const result = await this.propertyModel.deleteMany({}).exec()
    console.log(`[PropertiesService] Deleted ${result.deletedCount} properties from MongoDB`)
    return { deletedCount: result.deletedCount || 0 }
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
      // SOLO usar XML de Inmovilla - NO usar MongoDB como fallback
      console.log(`[PropertiesService] Loading properties from XML: ${this.XML_URL}`)
      const xmlProperties = await this.loadPropertiesFromXML()
      console.log(`[PropertiesService] Loaded ${xmlProperties?.length || 0} properties from XML`)
      
      if (xmlProperties && xmlProperties.length > 0) {
        // Aplicar filtros a propiedades del XML
        const filtered = this.filterProperties(xmlProperties, query)
        console.log(`[PropertiesService] After filtering: ${filtered.length} properties`)
        return filtered
      }

      // Si no hay XML, devolver array vacío (NO usar MongoDB)
      console.log('[PropertiesService] No XML properties found. Returning empty array.')
      return []
    } catch (error) {
      console.error('[PropertiesService] Error fetching properties:', error)
      if (error instanceof Error) {
        console.error('[PropertiesService] Error message:', error.message)
        console.error('[PropertiesService] Error stack:', error.stack)
      }
      // Devolver array vacío en caso de error
      return []
    }
  }

  private filterProperties(properties: Property[], query: {
    type?: string
    city?: string
    minPrice?: number
    maxPrice?: number
    bedrooms?: number
    minArea?: number
    status?: string
  }): Property[] {
    return properties.filter(prop => {
      if (query.status && prop.status !== query.status) return false
      if (query.type && prop.type !== query.type) return false
      if (query.city && prop.location?.city?.toLowerCase().includes(query.city.toLowerCase()) === false) return false
      if (query.minPrice && prop.price < query.minPrice) return false
      if (query.maxPrice && prop.price > query.maxPrice) return false
      if (query.bedrooms && prop.features?.bedrooms < query.bedrooms) return false
      if (query.minArea && prop.features?.area < query.minArea) return false
      return true
    })
  }

  private async loadPropertiesFromXML(): Promise<Property[]> {
    const now = Date.now()
    
    // CACHÉ DESHABILITADO TEMPORALMENTE PARA FORZAR RECARGA DEL XML
    // if (this.xmlCache && (now - this.xmlCacheTime) < this.CACHE_DURATION) {
    //   console.log('[PropertiesService] Returning cached properties')
    //   return this.xmlCache
    // }
    
    console.log('[PropertiesService] Loading fresh XML data (cache disabled)')

    try {
      let xmlContent: string

      // Intentar leer desde URL primero
      if (this.XML_URL && this.XML_URL.startsWith('http')) {
        xmlContent = await this.fetchXMLFromURL(this.XML_URL)
      } else {
        // Leer desde archivo local
        xmlContent = await this.readXMLFromFile(this.XML_LOCAL_PATH)
      }

      if (!xmlContent) {
        console.warn('No se pudo cargar el XML de Inmovilla')
        return []
      }

      // Parsear XML
      console.log(`[PropertiesService] Parsing XML content (${xmlContent.length} chars)`)
      const parser = new xml2js.Parser({ explicitArray: false, mergeAttrs: true })
      const result = await parser.parseStringPromise(xmlContent)
      
      console.log('[PropertiesService] XML parsed, checking structure...')
      if (!result.propiedades || !result.propiedades.propiedad) {
        console.warn('[PropertiesService] XML de Inmovilla no tiene el formato esperado')
        console.warn('[PropertiesService] XML structure:', JSON.stringify(Object.keys(result), null, 2))
        return []
      }

      const propiedades = Array.isArray(result.propiedades.propiedad) 
        ? result.propiedades.propiedad 
        : [result.propiedades.propiedad]

      console.log(`[PropertiesService] Found ${propiedades.length} propiedades in XML`)
      // Transformar propiedades del XML al formato Property
      const properties = propiedades.map((prop: any) => this.transformInmovillaProperty(prop)).filter(Boolean)
      console.log(`[PropertiesService] Successfully transformed ${properties.length} properties`)

      // Actualizar caché
      this.xmlCache = properties
      this.xmlCacheTime = now

      return properties
    } catch (error) {
      console.error('[PropertiesService] Error loading properties from XML:', error)
      if (error instanceof Error) {
        console.error('[PropertiesService] Error message:', error.message)
        console.error('[PropertiesService] Error stack:', error.stack)
      }
      return []
    }
  }

  private transformInmovillaProperty(prop: any): Property | null {
    try {
      // Extraer imágenes
      const images: string[] = []
      for (let i = 1; i <= 20; i++) {
        const foto = prop[`foto${i}`]
        if (foto && typeof foto === 'string' && foto.trim()) {
          images.push(foto.trim())
        }
      }

      // Determinar tipo (venta/alquiler)
      const accion = prop.accion?.toLowerCase() || ''
      const precioAlq = parseFloat(prop.precioalq || '0') || 0
      const precioInmo = parseFloat(prop.precioinmo || '0') || 0
      
      let tipo = 'venta' // Por defecto
      if (accion.includes('alquilar') || accion.includes('alquiler') || precioAlq > 0) {
        tipo = 'alquiler'
      } else if (accion.includes('vender') || accion.includes('venta') || precioInmo > 0) {
        tipo = 'venta'
      }

      // Precio (priorizar según tipo)
      const precio = tipo === 'alquiler' 
        ? (parseFloat(prop.precioalq || '0') || 0)
        : (parseFloat(prop.precioinmo || prop.precio || '0') || 0)

      // Características
      const habitaciones = parseInt(prop.habdobles || prop.habitaciones || '0') || 0
      const banos = parseInt(prop.banyos || '0') || 0
      const area = parseFloat(prop.m_cons || prop.m_uties || '0') || 0
      const planta = parseInt(prop.numplanta || '0') || undefined

      // Ubicación
      const ciudad = prop.ciudad || ''
      const zona = prop.zona || ''
      const cp = prop.cp || ''
      const provincia = this.extractProvinceFromCP(cp) || ciudad

      // Título y descripción
      const titulo = prop.titulo1 || prop.titulo2 || `Propiedad en ${ciudad}`
      const descripcion = prop.descrip1 || prop.descrip2 || prop.tinterior || ''

      // Características adicionales
      const parking = prop.plaza_gara === '1' || prop.parking === '1' || prop.garaje === '1'
      const ascensor = prop.ascensor === '1' || prop.ascensor === 1
      const terraza = prop.terraza === '1' || prop.terraza === 1 || prop.balcon === '1'
      const jardin = prop.jardin === '1' || prop.jardin === 1
      const piscina = prop.piscina_prop === '1' || prop.piscina_com === '1'
      const amueblado = prop.muebles === '1' || prop.muebles === 1

      const property: Property = {
        _id: prop.id?.toString() || '',
        codOfer: prop.id?.toString() || '',
        title: titulo,
        description: descripcion,
        type: tipo as 'venta' | 'alquiler',
        price: precio,
        location: {
          address: zona || ciudad,
          city: ciudad,
          province: provincia,
          coordinates: prop.latitud && prop.altitud 
            ? [parseFloat(prop.latitud), parseFloat(prop.altitud)]
            : undefined
        },
        features: {
          bedrooms: habitaciones,
          bathrooms: banos,
          area: area,
          floor: planta,
          parking: parking,
          elevator: ascensor,
          terrace: terraza,
          garden: jardin,
          pool: piscina,
          furnished: amueblado
        },
        images: images,
        status: 'published',
        createdAt: new Date(),
        updatedAt: new Date()
      }

      return property
    } catch (error) {
      console.error('Error transforming Inmovilla property:', error)
      return null
    }
  }

  private extractProvinceFromCP(cp: string): string {
    // Extraer provincia del código postal (primeros 2 dígitos)
    if (!cp || cp.length < 2) return ''
    const cpNum = parseInt(cp.substring(0, 2))
    // Mapeo básico de códigos postales españoles
    if (cpNum >= 1 && cpNum <= 28) return 'Madrid'
    if (cpNum >= 29 && cpNum <= 41) return 'Sevilla'
    if (cpNum >= 41 && cpNum <= 45) return 'Toledo'
    return ''
  }

  private async fetchXMLFromURL(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
      console.log(`[PropertiesService] Fetching XML from URL: ${url}`)
      const client = url.startsWith('https') ? https : http
      client.get(url, (res) => {
        console.log(`[PropertiesService] HTTP Status: ${res.statusCode}`)
        if (res.statusCode !== 200) {
          reject(new Error(`HTTP ${res.statusCode}: ${res.statusMessage}`))
          return
        }
        let data = ''
        res.on('data', (chunk) => { data += chunk })
        res.on('end', () => {
          console.log(`[PropertiesService] XML fetched successfully (${data.length} chars)`)
          resolve(data)
        })
        res.on('error', (err) => {
          console.error('[PropertiesService] Error reading XML stream:', err)
          reject(err)
        })
      }).on('error', (err) => {
        console.error('[PropertiesService] Error fetching XML:', err)
        reject(err)
      })
    })
  }

  private async readXMLFromFile(filePath: string): Promise<string> {
    try {
      if (fs.existsSync(filePath)) {
        return fs.readFileSync(filePath, 'utf-8')
      }
      return ''
    } catch (error) {
      console.error('Error reading XML file:', error)
      return ''
    }
  }

  async findOne(id: string): Promise<Property> {
    // Intentar buscar por codOfer primero (formato numérico de Inmovilla)
    if (/^\d+$/.test(id)) {
      const xmlProperties = await this.loadPropertiesFromXML()
      const propertyByCod = xmlProperties.find(p => p.codOfer === id)
      if (propertyByCod) {
        return propertyByCod
      }
    }

    // Buscar en MongoDB
    const property = await this.propertyModel.findById(id).exec()
    if (!property) {
      throw new NotFoundException(`Property with ID ${id} not found`)
    }
    return property
  }

  async findByCodOfer(codOfer: string): Promise<Property | null> {
    try {
      const xmlProperties = await this.loadPropertiesFromXML()
      const property = xmlProperties.find(p => p.codOfer === codOfer)
      if (property) {
        return property
      }

      // También buscar en MongoDB por codOfer
      const mongoProperty = await this.propertyModel.findOne({ codOfer }).exec()
      return mongoProperty || null
    } catch (error) {
      console.error('Error finding property by codOfer:', error)
      return null
    }
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

