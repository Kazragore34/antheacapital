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

  async debug(): Promise<any> {
    try {
      const xmlProperties = await this.loadPropertiesFromXML()
      return {
        xmlUrl: this.XML_URL,
        xmlLocalPath: this.XML_LOCAL_PATH,
        propertiesFound: xmlProperties.length,
        firstProperty: xmlProperties.length > 0 ? {
          codOfer: xmlProperties[0].codOfer,
          title: xmlProperties[0].title,
          price: xmlProperties[0].price,
          type: xmlProperties[0].type,
          city: xmlProperties[0].location?.city,
        } : null,
        allProperties: xmlProperties.map(p => ({
          codOfer: p.codOfer,
          title: p.title,
          price: p.price,
          type: p.type,
        })),
      }
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      }
    }
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
      console.log(`[PropertiesService] findAll() called with query:`, JSON.stringify(query))
      console.log(`[PropertiesService] Loading properties from XML: ${this.XML_URL}`)
      console.log(`[PropertiesService] XML_LOCAL_PATH: ${this.XML_LOCAL_PATH}`)
      
      const xmlProperties = await this.loadPropertiesFromXML()
      console.log(`[PropertiesService] Loaded ${xmlProperties?.length || 0} properties from XML`)
      
      if (xmlProperties && xmlProperties.length > 0) {
        // Aplicar filtros a propiedades del XML
        const filtered = this.filterProperties(xmlProperties, query)
        console.log(`[PropertiesService] After filtering: ${filtered.length} properties`)
        return filtered
      }

      // Si no hay XML, devolver array vacío (NO usar MongoDB)
      console.warn('[PropertiesService] No XML properties found. Returning empty array.')
      console.warn('[PropertiesService] This could mean:')
      console.warn('  1. XML URL is not accessible')
      console.warn('  2. XML file is not found locally')
      console.warn('  3. XML structure is not as expected')
      console.warn('  4. All properties were filtered out during transformation')
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
      console.log('[PropertiesService] XML root keys:', Object.keys(result))
      
      // El XML puede tener estructura: propiedades.propiedad o propiedades.propiedad[].datos
      let propiedades: any[] = []
      
      if (result.propiedades && result.propiedades.propiedad) {
        const props = Array.isArray(result.propiedades.propiedad) 
          ? result.propiedades.propiedad 
          : [result.propiedades.propiedad]
        
        // Si las propiedades tienen estructura con <datos>, extraer los datos
        propiedades = props.map((prop: any, index: number) => {
          // Si tiene estructura con datos, combinar datos con propiedades del nivel superior
          // IMPORTANTE: prop.datos tiene prioridad sobre prop para evitar sobrescribir campos
          if (prop.datos) {
            const combined = { ...prop, ...prop.datos } // Primero prop, luego datos (datos tiene prioridad)
            console.log(`[PropertiesService] Property ${index + 1}: cod_ofer=${combined.ofertas_cod_ofer || combined.id}, has ${Object.keys(combined).length} fields`)
            return combined
          }
          console.log(`[PropertiesService] Property ${index + 1}: no datos structure, has ${Object.keys(prop).length} fields`)
          return prop
        })
      } else {
        console.warn('[PropertiesService] XML de Inmovilla no tiene el formato esperado')
        console.warn('[PropertiesService] XML structure:', JSON.stringify(Object.keys(result), null, 2))
        return []
      }

      console.log(`[PropertiesService] Found ${propiedades.length} propiedades in XML`)
      
      // Log primera propiedad para debugging
      if (propiedades.length > 0) {
        const firstProp = propiedades[0]
        console.log(`[PropertiesService] First property keys: ${Object.keys(firstProp).slice(0, 20).join(', ')}...`)
        console.log(`[PropertiesService] First property cod_ofer: ${firstProp.ofertas_cod_ofer || firstProp.id || 'NOT FOUND'}`)
        console.log(`[PropertiesService] First property precio: ${firstProp.ofertas_precioinmo || firstProp.ofertas_precioalq || 'NOT FOUND'}`)
      }
      
      // Transformar propiedades del XML al formato Property
      const properties = propiedades.map((prop: any, index: number) => {
        const transformed = this.transformInmovillaProperty(prop)
        if (!transformed) {
          console.warn(`[PropertiesService] Property ${index + 1} was filtered out during transformation`)
        }
        return transformed
      }).filter(Boolean)
      
      console.log(`[PropertiesService] Successfully transformed ${properties.length} properties from ${propiedades.length} XML entries`)

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
      // Extraer cod_ofer (campo clave de Inmovilla)
      // El XML tiene: <ofertas_cod_ofer>6664661</ofertas_cod_ofer> dentro de <datos>
      const codOfer = prop.ofertas_cod_ofer?.toString() || prop.datos?.ofertas_cod_ofer?.toString() || prop.datos?.id?.toString() || prop.id?.toString() || ''
      if (!codOfer) {
        console.warn('[PropertiesService] Property without cod_ofer, skipping. Available keys:', Object.keys(prop).slice(0, 10).join(', '))
        return null
      }
      
      console.log(`[PropertiesService] Transforming property ${codOfer}`)

      // Extraer imágenes
      const images: string[] = []
      for (let i = 1; i <= 20; i++) {
        const foto = prop[`ofertas_foto${i}`] || prop[`foto${i}`]
        if (foto && typeof foto === 'string' && foto.trim()) {
          images.push(foto.trim())
        }
      }

      // Determinar tipo (venta/alquiler)
      const accion = (prop.accionoferta_accion || prop.accion || '').toLowerCase()
      const precioAlq = parseFloat(prop.ofertas_precioalq || prop.precioalq || '0') || 0
      const precioInmo = parseFloat(prop.ofertas_precioinmo || prop.precioinmo || '0') || 0
      
      let tipo = 'venta' // Por defecto
      if (accion.includes('alquilar') || accion.includes('alquiler') || precioAlq > 0) {
        tipo = 'alquiler'
      } else if (accion.includes('vender') || accion.includes('venta') || precioInmo > 0) {
        tipo = 'venta'
      }

      // Precio (priorizar según tipo)
      const precio = tipo === 'alquiler' 
        ? precioAlq
        : precioInmo

      if (precio === 0) {
        console.warn(`[PropertiesService] Property ${codOfer} has price 0, skipping`)
        return null
      }

      // Características
      const habitaciones = parseInt(prop.ofertas_habdobles || prop.habdobles || prop.ofertas_habitaciones || prop.habitaciones || '0') || 0
      const banos = parseInt(prop.ofertas_banyos || prop.banyos || '0') || 0
      const area = parseFloat(prop.ofertas_m_cons || prop.m_cons || prop.ofertas_m_uties || prop.m_uties || '0') || 0
      const planta = parseInt(prop.ofertas_numplanta || prop.numplanta || prop.ofertas_planta || prop.planta || '0') || undefined

      // Ubicación
      const ciudad = prop.ciudad_ciudad || prop.ciudad || ''
      const zona = prop.zonas_zona || prop.zona || ''
      const cp = prop.ofertas_cp || prop.cp || ''
      const provincia = (prop.provincias_provincia || prop.provincia || this.extractProvinceFromCP(cp) || ciudad).trim()
      const calle = prop.ofertas_calle || prop.calle || ''
      const numero = prop.ofertas_numero || prop.numero || ''
      const direccion = [calle, numero].filter(Boolean).join(' ') || zona || ciudad

      // Título y descripción
      const titulo = prop.ofertas_titulo1 || prop.titulo1 || prop.ofertas_titulo2 || prop.titulo2 || `Propiedad en ${ciudad || 'Aranjuez'}`
      const descripcion = prop.ofertas_descrip1 || prop.descrip1 || prop.ofertas_descrip2 || prop.descrip2 || prop.ofertas_tinterior || prop.tinterior || ''

      // Características adicionales
      const parking = prop.plaza_gara?.includes('Garaje') || prop.ofertas_plaza_gara === '1' || prop.parking === '1' || prop.garaje === '1'
      const ascensor = prop.ofertas_ascensor === '1' || prop.ofertas_ascensor === 1 || prop.ascensor === '1' || prop.ascensor === 1
      const terraza = prop.ofertas_terraza === '1' || prop.terraza === '1' || prop.ofertas_balcon === '1' || prop.balcon === '1'
      const jardin = prop.ofertas_jardin === '1' || prop.jardin === '1' || prop.jardin === 1
      const piscina = prop.ofertas_piscina_prop === '1' || prop.piscina_prop === '1' || prop.ofertas_piscina_com === '1' || prop.piscina_com === '1'
      const amueblado = prop.ofertas_muebles === '1' || prop.ofertas_muebles === 1 || prop.muebles === '1' || prop.muebles === 1

      const property: Property = {
        _id: codOfer,
        codOfer: codOfer,
        title: titulo,
        description: descripcion,
        type: tipo as 'venta' | 'alquiler',
        price: precio,
        location: {
          address: direccion,
          city: ciudad || 'Aranjuez',
          province: provincia || 'Madrid',
          coordinates: prop.ofertas_latitud && prop.ofertas_altitud 
            ? [parseFloat(prop.ofertas_latitud), parseFloat(prop.ofertas_altitud)]
            : (prop.latitud && prop.altitud 
              ? [parseFloat(prop.latitud), parseFloat(prop.altitud)]
              : undefined)
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

