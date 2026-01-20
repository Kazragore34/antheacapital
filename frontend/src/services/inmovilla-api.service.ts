import { Property } from '../types'

/**
 * Servicio para interactuar con la API de Inmovilla mediante el proxy PHP
 * Ventajas sobre XML:
 * - Datos en tiempo real (no hay que esperar actualización diaria)
 * - Filtros avanzados
 * - Búsqueda específica por codOfer
 */
class InmovillaAPIService {
  // Usar API de Inmovilla con apiinmovilla.php (numagencia/password)
  private readonly API_URL = '/api-inmovilla-proxy.php'

  /**
   * Obtener todas las propiedades con filtros opcionales
   */
  async getAll(filters?: {
    limit?: number
    offset?: number
    type?: 'venta' | 'alquiler' | 'todos'
    city?: string
    minPrice?: number
    maxPrice?: number
    bedrooms?: number
    order?: string
  }): Promise<Property[]> {
    try {
      const params = new URLSearchParams({
        action: 'propiedades',
        limit: String(filters?.limit || 1000),
        offset: String(filters?.offset || 1),
      })

      // Construir filtro WHERE
      const whereConditions: string[] = []
      
      if (filters?.type && filters.type !== 'todos') {
        whereConditions.push(`ofertas_tipo_inmo=${filters.type === 'venta' ? 'Vender' : 'Alquilar'}`)
      }
      
      if (filters?.city) {
        whereConditions.push(`ciudad_ciudad=${encodeURIComponent(filters.city)}`)
      }
      
      if (filters?.minPrice) {
        whereConditions.push(`ofertas_precioinmo>=${filters.minPrice}`)
      }
      
      if (filters?.maxPrice) {
        whereConditions.push(`ofertas_precioinmo<=${filters.maxPrice}`)
      }
      
      if (filters?.bedrooms) {
        whereConditions.push(`ofertas_habdobles>=${filters.bedrooms}`)
      }

      if (whereConditions.length > 0) {
        params.append('where', whereConditions.join('&'))
      }

      if (filters?.order) {
        params.append('order', filters.order)
      }

      console.log(`[InmovillaAPI] Cargando propiedades desde API: ${this.API_URL}?${params}`)
      
      const response = await fetch(`${this.API_URL}?${params}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Error desconocido en la API')
      }

      console.log(`[InmovillaAPI] Respuesta recibida:`, result)

      // Transformar propiedades de la API al formato interno
      const properties = this.transformProperties(result.data?.paginacion || [])

      console.log(`[InmovillaAPI] Transformadas ${properties.length} propiedades`)

      return properties
    } catch (error) {
      console.error('[InmovillaAPI] Error cargando propiedades:', error)
      // NO usar XML como fallback - si la API falla, devolver vacío
      // Esto fuerza a que se solucione el problema de la API en lugar de usar datos antiguos
      return []
    }
  }

  /**
   * Obtener una propiedad específica por codOfer
   */
  async getByCodOfer(codOfer: string): Promise<Property | null> {
    try {
      const params = new URLSearchParams({
        action: 'ficha',
        codOfer: codOfer,
      })

      console.log(`[InmovillaAPI] Cargando propiedad ${codOfer} desde API`)

      const response = await fetch(`${this.API_URL}?${params}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()

      if (!result.success || !result.data?.ficha || result.data.ficha.length === 0) {
        console.warn(`[InmovillaAPI] Propiedad ${codOfer} no encontrada`)
        return null
      }

      return this.transformProperty(result.data.ficha[0])
    } catch (error) {
      console.error(`[InmovillaAPI] Error cargando propiedad ${codOfer}:`, error)
      return null
    }
  }

  /**
   * Obtener propiedades destacadas
   */
  async getFeatured(limit: number = 6): Promise<Property[]> {
    try {
      const params = new URLSearchParams({
        action: 'destacados',
        limit: String(limit),
        order: 'precioinmo, precioalq',
      })

      const response = await fetch(`${this.API_URL}?${params}`)
      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Error desconocido')
      }

      return this.transformProperties(result.data?.destacados || [])
    } catch (error) {
      console.error('[InmovillaAPI] Error cargando destacados:', error)
      return []
    }
  }

  /**
   * Transformar array de propiedades de la API al formato interno
   */
  private transformProperties(apiProperties: any[]): Property[] {
    return apiProperties
      .map((prop) => this.transformProperty(prop))
      .filter((prop): prop is Property => prop !== null)
  }

  /**
   * Transformar una propiedad de la API al formato interno
   */
  private transformProperty(apiProp: any): Property | null {
    try {
      // Extraer codOfer
      const codOfer = apiProp.ofertas_cod_ofer?.toString() || apiProp.id?.toString() || ''
      
      if (!codOfer) {
        console.warn('[InmovillaAPI] Property sin codOfer, saltando')
        return null
      }

      // Determinar tipo
      const tipoInmo = apiProp.ofertas_tipo_inmo || apiProp.tipo_inmo || ''
      let tipo: 'venta' | 'alquiler' = 'alquiler'
      
      if (tipoInmo.toLowerCase().includes('venta') || tipoInmo.toLowerCase().includes('vender')) {
        tipo = 'venta'
      } else if (tipoInmo.toLowerCase().includes('alquiler') || tipoInmo.toLowerCase().includes('alquilar')) {
        tipo = 'alquiler'
      } else {
        // Inferir del precio
        const precioVenta = parseFloat(apiProp.ofertas_precioinmo || apiProp.precioinmo || '0') || 0
        const precioAlq = parseFloat(apiProp.ofertas_precioalq || apiProp.precioalq || '0') || 0
        if (precioVenta > 0 && precioAlq === 0) {
          tipo = 'venta'
        } else if (precioAlq > 0 && precioVenta === 0) {
          tipo = 'alquiler'
        } else if (precioVenta > 0 && precioAlq > 0) {
          tipo = 'venta' // Priorizar venta si ambos existen
        } else {
          console.warn(`[InmovillaAPI] Propiedad ${codOfer} con tipo desconocido, saltando`)
          return null
        }
      }

      // Precio
      let precio = parseFloat(apiProp.ofertas_precioinmo || apiProp.precioinmo || '0') || 0
      if (precio === 0) {
        precio = parseFloat(apiProp.ofertas_precioalq || apiProp.precioalq || '0') || 0
      }

      // Ubicación
      const ciudad = apiProp.ciudad_ciudad || apiProp.ciudad || ''
      const zona = apiProp.zonas_zona || apiProp.zona || ''
      const cp = apiProp.ofertas_cp || apiProp.cp || ''
      const provincia = (apiProp.provincias_provincia || apiProp.provincia || this.extractProvinceFromCP(cp) || ciudad).trim()
      const calle = apiProp.ofertas_calle || apiProp.calle || ''
      const numero = apiProp.ofertas_numero || apiProp.numero || ''
      const direccion = [calle, numero].filter(Boolean).join(' ') || zona || ciudad

      // Título y descripción
      const titulo = apiProp.ofertas_titulo1 || apiProp.titulo1 || apiProp.ofertas_titulo2 || apiProp.titulo2 || `Propiedad en ${ciudad || 'Aranjuez'}`
      const descripcion = apiProp.ofertas_descrip1 || apiProp.descrip1 || apiProp.ofertas_descrip2 || apiProp.descrip2 || apiProp.ofertas_tinterior || apiProp.tinterior || ''

      // Filtrar si no hay datos válidos
      if (precio === 0 && !titulo && !ciudad) {
        console.warn(`[InmovillaAPI] Property ${codOfer} sin datos válidos, saltando`)
        return null
      }

      // Características
      const habitaciones = parseInt(apiProp.ofertas_habdobles || apiProp.habdobles || apiProp.ofertas_habitaciones || apiProp.habitaciones || '0') || 0
      const banos = parseInt(apiProp.ofertas_banyos || apiProp.banyos || '0') || 0
      const area = parseFloat(apiProp.ofertas_m_cons || apiProp.m_cons || apiProp.ofertas_m_uties || apiProp.m_uties || '0') || 0
      const planta = parseInt(apiProp.ofertas_numplanta || apiProp.numplanta || apiProp.ofertas_planta || apiProp.planta || '0') || undefined

      // Características adicionales
      const parking = apiProp.plaza_gara?.includes('Garaje') || apiProp.ofertas_plaza_gara === '1' || apiProp.parking === '1' || apiProp.garaje === '1'
      const ascensor = apiProp.ofertas_ascensor === '1' || apiProp.ofertas_ascensor === 1 || apiProp.ascensor === '1' || apiProp.ascensor === 1
      const terraza = apiProp.ofertas_terraza === '1' || apiProp.terraza === '1' || apiProp.ofertas_balcon === '1' || apiProp.balcon === '1'
      const jardin = apiProp.ofertas_jardin === '1' || apiProp.jardin === '1' || apiProp.jardin === 1
      const piscina = apiProp.ofertas_piscina_prop === '1' || apiProp.piscina_prop === '1' || apiProp.ofertas_piscina_com === '1' || apiProp.piscina_com === '1'
      const amueblado = apiProp.ofertas_muebles === '1' || apiProp.ofertas_muebles === 1 || apiProp.muebles === '1' || apiProp.muebles === 1

      // Imágenes
      const images: string[] = []
      // Buscar en campos directos como foto1, foto2, etc.
      for (let i = 1; i <= 20; i++) {
        const fotoKey = `ofertas_foto${i}`
        const fotoKeyAlt = `foto${i}`
        const foto = apiProp[fotoKey] || apiProp[fotoKeyAlt]
        if (foto && typeof foto === 'string' && foto.startsWith('http') && !images.includes(foto)) {
          images.push(foto)
        }
      }

      const property: Property = {
        _id: codOfer,
        codOfer: codOfer,
        title: titulo,
        description: descripcion,
        type: tipo,
        price: precio,
        location: {
          address: direccion,
          city: ciudad,
          province: provincia,
        },
        features: {
          bedrooms: habitaciones,
          bathrooms: banos,
          area: area,
          floor: planta,
          parking: parking || undefined,
          elevator: ascensor || undefined,
          terrace: terraza || undefined,
          garden: jardin || undefined,
          pool: piscina || undefined,
          furnished: amueblado || undefined,
        },
        images: images.length > 0 ? images : ['https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1200'],
        status: 'published',
      }

      return property
    } catch (error) {
      console.error('[InmovillaAPI] Error transformando propiedad:', error)
      return null
    }
  }

  /**
   * Extraer provincia del código postal
   */
  private extractProvinceFromCP(cp: string): string {
    if (!cp || cp.length < 2) return ''
    const cpNum = parseInt(cp.substring(0, 2))
    const provincias: { [key: number]: string } = {
      28: 'Madrid',
    }
    return provincias[cpNum] || ''
  }
}

export const inmovillaAPIService = new InmovillaAPIService()
