import { Property } from '../types'

/**
 * Servicio para interactuar con la API de Inmovilla mediante el proxy PHP
 * Ventajas sobre XML:
 * - Datos en tiempo real (no hay que esperar actualización diaria)
 * - Filtros avanzados
 * - Búsqueda específica por codOfer
 */
class InmovillaAPIService {
  // Usar API REST de Inmovilla (funciona sin autorización de IP)
  // El endpoint 'propiedades' obtiene listado básico y luego detalles completos usando 'ficha'
  private readonly API_URL = '/api-inmovilla-rest-proxy.php'

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

      // La API REST devuelve directamente un array según la documentación
      // Estructura del proxy: {success: true, data: {paginacion: [{cod_ofer: ..., ref: ..., ...}, ...]}}
      let apiProperties = []
      if (result.success && result.data) {
        if (Array.isArray(result.data.paginacion)) {
          apiProperties = result.data.paginacion
        } else if (Array.isArray(result.data)) {
          apiProperties = result.data
        }
      } else if (Array.isArray(result.paginacion)) {
        apiProperties = result.paginacion
      } else if (Array.isArray(result)) {
        apiProperties = result
      }

      console.log(`[InmovillaAPI] Propiedades extraídas: ${apiProperties.length}`)
      if (apiProperties.length > 0) {
        console.log(`[InmovillaAPI] Primera propiedad completa:`, JSON.stringify(apiProperties[0], null, 2))
        console.log(`[InmovillaAPI] Keys de la primera propiedad:`, Object.keys(apiProperties[0]))
        
        // Verificar campos específicos
        const primera = apiProperties[0]
        console.log(`[InmovillaAPI] Verificación de campos:`)
        console.log(`  - cod_ofer:`, primera.cod_ofer)
        console.log(`  - ref:`, primera.ref)
        console.log(`  - ofertas_titulo1:`, primera.ofertas_titulo1)
        console.log(`  - titulo1:`, primera.titulo1)
        console.log(`  - ofertas_precioinmo:`, primera.ofertas_precioinmo)
        console.log(`  - ofertas_precioalq:`, primera.ofertas_precioalq)
        console.log(`  - ofertas_tipo_inmo:`, primera.ofertas_tipo_inmo)
        console.log(`  - ofertas_foto1:`, primera.ofertas_foto1)
        console.log(`  - foto1:`, primera.foto1)
      }

      // Transformar propiedades de la API al formato interno
      const properties = this.transformProperties(apiProperties)

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
      console.log(`[InmovillaAPI] Transformando propiedad, objeto recibido:`, apiProp)
      console.log(`[InmovillaAPI] Tipo del objeto:`, typeof apiProp)
      console.log(`[InmovillaAPI] Es array?:`, Array.isArray(apiProp))
      console.log(`[InmovillaAPI] Keys disponibles:`, Object.keys(apiProp))
      
      // Extraer codOfer - la API REST devuelve cod_ofer (con guión bajo)
      const codOfer = apiProp.cod_ofer?.toString() 
        || apiProp.ofertas_cod_ofer?.toString() 
        || apiProp.id?.toString() 
        || ''
      
      console.log(`[InmovillaAPI] codOfer extraído:`, codOfer)
      
      if (!codOfer) {
        console.warn('[InmovillaAPI] Property sin codOfer, saltando. Keys disponibles:', Object.keys(apiProp).slice(0, 10))
        console.warn('[InmovillaAPI] Propiedad completa:', JSON.stringify(apiProp, null, 2))
        return null
      }

      // Determinar tipo - la API REST devuelve keyacci (2 = alquiler, probablemente)
      // También podemos inferir del precio
      const tipoInmo = apiProp.ofertas_tipo_inmo || apiProp.tipo_inmo || ''
      const keyacci = apiProp.keyacci // API REST: 2 = alquiler, probablemente 1 = venta
      
      let tipo: 'venta' | 'alquiler' = 'venta' // Por defecto venta
      
      // Determinar por keyacci primero (más confiable)
      if (keyacci === 2 || keyacci === '2') {
        tipo = 'alquiler'
      } else if (keyacci === 1 || keyacci === '1') {
        tipo = 'venta'
      } else if (tipoInmo && tipoInmo.toLowerCase().includes('venta') || tipoInmo && tipoInmo.toLowerCase().includes('vender')) {
        tipo = 'venta'
      } else if (tipoInmo && tipoInmo.toLowerCase().includes('alquiler') || tipoInmo && tipoInmo.toLowerCase().includes('alquilar')) {
        tipo = 'alquiler'
      } else {
        // Inferir del precio si está disponible
        const precioVenta = parseFloat(apiProp.precioinmo?.toString() || apiProp.ofertas_precioinmo?.toString() || '0') || 0
        const precioAlq = parseFloat(apiProp.precioalq?.toString() || apiProp.ofertas_precioalq?.toString() || '0') || 0
        if (precioVenta > 0 && precioAlq === 0) {
          tipo = 'venta'
        } else if (precioAlq > 0 && precioVenta === 0) {
          tipo = 'alquiler'
        } else if (precioVenta > 0 && precioAlq > 0) {
          tipo = 'venta' // Priorizar venta si ambos existen
        }
        // Si no hay precio ni tipo, mantener 'venta' por defecto
      }
      
      console.log(`[InmovillaAPI] Tipo determinado:`, tipo, { keyacci, tipoInmo })

      // Precio - la API REST devuelve precioalq y precioinmo directamente
      let precio = parseFloat(apiProp.precioinmo?.toString() || apiProp.ofertas_precioinmo?.toString() || apiProp.precioinmo?.toString() || '0') || 0
      if (precio === 0) {
        precio = parseFloat(apiProp.precioalq?.toString() || apiProp.ofertas_precioalq?.toString() || apiProp.precioalq?.toString() || '0') || 0
      }
      
      console.log(`[InmovillaAPI] Precio determinado:`, precio, {
        precioinmo: apiProp.precioinmo,
        precioalq: apiProp.precioalq,
        ofertas_precioinmo: apiProp.ofertas_precioinmo,
        ofertas_precioalq: apiProp.ofertas_precioalq
      })

      // Ubicación
      const ciudad = apiProp.ciudad_ciudad || apiProp.ciudad || ''
      const zona = apiProp.zonas_zona || apiProp.zona || ''
      const cp = apiProp.ofertas_cp || apiProp.cp || ''
      const provincia = (apiProp.provincias_provincia || apiProp.provincia || this.extractProvinceFromCP(cp) || ciudad).trim()
      const calle = apiProp.ofertas_calle || apiProp.calle || ''
      const numero = apiProp.ofertas_numero || apiProp.numero || ''
      const direccion = [calle, numero].filter(Boolean).join(' ') || zona || ciudad

      // Título y descripción - la API REST devuelve tituloes y descripciones
      const ref = apiProp.ref || codOfer
      
      // Buscar título en múltiples campos posibles (incluyendo campos de API REST)
      const titulo = apiProp.tituloes  // Campo de API REST
        || apiProp.ofertas_titulo1 
        || apiProp.titulo1 
        || apiProp.ofertas_titulo2 
        || apiProp.titulo2
        || apiProp.titulo
        || apiProp.nombre
        || `Propiedad ${ref}`
      
      console.log(`[InmovillaAPI] Título encontrado:`, titulo)
      console.log(`[InmovillaAPI] Campos de título disponibles:`, {
        tituloes: apiProp.tituloes, // Campo de API REST
        ofertas_titulo1: apiProp.ofertas_titulo1,
        titulo1: apiProp.titulo1,
        ofertas_titulo2: apiProp.ofertas_titulo2,
        titulo2: apiProp.titulo2,
        titulo: apiProp.titulo,
        nombre: apiProp.nombre
      })
      
      // Buscar descripción en múltiples campos posibles (incluyendo campos de API REST)
      const descripcion = apiProp.descripciones  // Campo de API REST
        || apiProp.ofertas_descrip1 
        || apiProp.descrip1 
        || apiProp.ofertas_descrip2 
        || apiProp.descrip2 
        || apiProp.ofertas_tinterior 
        || apiProp.tinterior
        || apiProp.descripcion
        || apiProp.descrip
        || ''
      
      console.log(`[InmovillaAPI] Descripción encontrada (longitud: ${descripcion.length}):`, descripcion.substring(0, 100))

      // El listado básico solo tiene cod_ofer, ref, nodisponible, prospecto, fechaact
      // Si no hay más datos, crear una propiedad básica que se completará al hacer clic
      // No filtrar propiedades del listado básico, solo las que no tienen codOfer

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

      // Imágenes - buscar en múltiples campos posibles
      const images: string[] = []
      
      // Buscar en campos directos como foto1, foto2, etc.
      for (let i = 1; i <= 20; i++) {
        const fotoKey = `ofertas_foto${i}`
        const fotoKeyAlt = `foto${i}`
        const fotoKeyAlt2 = `imagen${i}`
        const fotoKeyAlt3 = `image${i}`
        const foto = apiProp[fotoKey] || apiProp[fotoKeyAlt] || apiProp[fotoKeyAlt2] || apiProp[fotoKeyAlt3]
        
        if (foto) {
          // Si es un string con URL
          if (typeof foto === 'string' && (foto.startsWith('http') || foto.startsWith('/'))) {
            if (!images.includes(foto)) {
              images.push(foto)
            }
          }
          // Si es un objeto con URL
          else if (typeof foto === 'object' && foto.url) {
            if (!images.includes(foto.url)) {
              images.push(foto.url)
            }
          }
        }
      }
      
      // Buscar también en arrays de imágenes
      if (Array.isArray(apiProp.imagenes)) {
        apiProp.imagenes.forEach((img: any) => {
          const url = typeof img === 'string' ? img : img.url || img.src
          if (url && !images.includes(url)) {
            images.push(url)
          }
        })
      }
      
      if (Array.isArray(apiProp.fotos)) {
        apiProp.fotos.forEach((img: any) => {
          const url = typeof img === 'string' ? img : img.url || img.src
          if (url && !images.includes(url)) {
            images.push(url)
          }
        })
      }
      
      console.log(`[InmovillaAPI] Imágenes encontradas (${images.length}):`, images)

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
