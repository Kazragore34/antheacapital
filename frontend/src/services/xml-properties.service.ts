import { Property } from '../types'

// Usar proxy PHP para evitar problemas de CORS
const XML_URL = '/xml-proxy.php'

// Transformar propiedad del XML al formato Property
function transformInmovillaProperty(prop: any): Property | null {
  try {
    // Extraer codOfer
    const codOfer = prop.ofertas_cod_ofer?.toString() || prop.datos?.ofertas_cod_ofer?.toString() || ''
    
    if (!codOfer) {
      console.warn('[XMLPropertiesService] Property sin codOfer, saltando')
      return null
    }

    // Tipo de propiedad - buscar en diferentes campos
    const tipoInmo = prop.ofertas_tipo_inmo || prop.tipo_inmo || prop.ofertas_tipo || prop.tipo || ''
    let tipo = 'alquiler' // Por defecto
    
    // Determinar tipo basado en precio o campo tipo
    if (tipoInmo.toLowerCase().includes('venta') || tipoInmo.toLowerCase().includes('vender')) {
      tipo = 'venta'
    } else if (tipoInmo.toLowerCase().includes('alquiler') || tipoInmo.toLowerCase().includes('alquiler')) {
      tipo = 'alquiler'
    } else {
      // Si no hay tipo claro, inferir del precio
      const precioInmo = parseFloat(prop.ofertas_precioinmo || prop.precioinmo || '0') || 0
      const precioAlq = parseFloat(prop.ofertas_precioalq || prop.precioalq || '0') || 0
      tipo = precioInmo > 0 ? 'venta' : (precioAlq > 0 ? 'alquiler' : 'alquiler')
    }

    // Precio
    const precioInmo = parseFloat(prop.ofertas_precioinmo || prop.precioinmo || '0') || 0
    const precioAlq = parseFloat(prop.ofertas_precioalq || prop.precioalq || '0') || 0
    let precio = tipo === 'venta' ? precioInmo : precioAlq
    if (precio === 0) {
      precio = parseFloat(prop.ofertas_precio || prop.precio || '0') || 0
    }

    // Ubicación (declarar primero)
    const ciudad = prop.ciudad_ciudad || prop.ciudad || ''
    const zona = prop.zonas_zona || prop.zona || ''
    const cp = prop.ofertas_cp || prop.cp || ''
    const provincia = (prop.provincias_provincia || prop.provincia || extractProvinceFromCP(cp) || ciudad).trim()
    const calle = prop.ofertas_calle || prop.calle || ''
    const numero = prop.ofertas_numero || prop.numero || ''
    const direccion = [calle, numero].filter(Boolean).join(' ') || zona || ciudad

    // Título y descripción (declarar antes de usar en filtro)
    const titulo = prop.ofertas_titulo1 || prop.titulo1 || prop.ofertas_titulo2 || prop.titulo2 || `Propiedad en ${ciudad || 'Aranjuez'}`
    const descripcion = prop.ofertas_descrip1 || prop.descrip1 || prop.ofertas_descrip2 || prop.descrip2 || prop.ofertas_tinterior || prop.tinterior || ''

    // Filtrar si no hay datos válidos
    if (precio === 0 && !titulo && !ciudad) {
      console.warn(`[XMLPropertiesService] Property ${codOfer} sin datos válidos, saltando`)
      return null
    }

    // Características
    const habitaciones = parseInt(prop.ofertas_habdobles || prop.habdobles || prop.ofertas_habitaciones || prop.habitaciones || '0') || 0
    const banos = parseInt(prop.ofertas_banyos || prop.banyos || '0') || 0
    const area = parseFloat(prop.ofertas_m_cons || prop.m_cons || prop.ofertas_m_uties || prop.m_uties || '0') || 0
    const planta = parseInt(prop.ofertas_numplanta || prop.numplanta || prop.ofertas_planta || prop.planta || '0') || undefined

    // Características adicionales
    const parking = prop.plaza_gara?.includes('Garaje') || prop.ofertas_plaza_gara === '1' || prop.parking === '1' || prop.garaje === '1'
    const ascensor = prop.ofertas_ascensor === '1' || prop.ofertas_ascensor === 1 || prop.ascensor === '1' || prop.ascensor === 1
    const terraza = prop.ofertas_terraza === '1' || prop.terraza === '1' || prop.ofertas_balcon === '1' || prop.balcon === '1'
    const jardin = prop.ofertas_jardin === '1' || prop.jardin === '1' || prop.jardin === 1
    const piscina = prop.ofertas_piscina_prop === '1' || prop.piscina_prop === '1' || prop.ofertas_piscina_com === '1' || prop.piscina_com === '1'
    const amueblado = prop.ofertas_muebles === '1' || prop.ofertas_muebles === 1 || prop.muebles === '1' || prop.muebles === 1

    // Imágenes - manejar estructura <fotos><foto>...</foto></fotos>
    const imagenes: string[] = []
    
    // Primero intentar desde estructura <fotos>
    if (prop.fotos) {
      if (Array.isArray(prop.fotos.foto)) {
        imagenes.push(...prop.fotos.foto.filter((url: string) => url && url.trim().startsWith('http')))
      } else if (typeof prop.fotos.foto === 'string' && prop.fotos.foto.trim().startsWith('http')) {
        imagenes.push(prop.fotos.foto)
      }
    }
    
    // Fallback a campos individuales
    if (imagenes.length === 0) {
      if (prop.ofertas_foto1) imagenes.push(prop.ofertas_foto1)
      if (prop.ofertas_foto2) imagenes.push(prop.ofertas_foto2)
      if (prop.ofertas_foto3) imagenes.push(prop.ofertas_foto3)
      if (prop.ofertas_foto4) imagenes.push(prop.ofertas_foto4)
      if (prop.ofertas_foto5) imagenes.push(prop.ofertas_foto5)
      if (prop.foto1) imagenes.push(prop.foto1)
      if (prop.foto2) imagenes.push(prop.foto2)
      if (prop.foto3) imagenes.push(prop.foto3)
      if (prop.foto4) imagenes.push(prop.foto4)
      if (prop.foto5) imagenes.push(prop.foto5)
    }

    const property: Property = {
      _id: codOfer,
      codOfer: codOfer,
      title: titulo,
      description: descripcion,
      type: tipo as 'venta' | 'alquiler',
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
      images: imagenes.length > 0 ? imagenes : ['https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1200'],
      status: 'published',
    }

    return property
  } catch (error) {
    console.error('[XMLPropertiesService] Error transformando propiedad:', error)
    return null
  }
}

// Extraer provincia del código postal
function extractProvinceFromCP(cp: string): string {
  if (!cp || cp.length < 2) return ''
  const cpNum = parseInt(cp.substring(0, 2))
  const provincias: { [key: number]: string } = {
    28: 'Madrid',
  }
  return provincias[cpNum] || ''
}

// Parsear XML
function parseXML(xmlText: string): any {
  const parser = new DOMParser()
  const xmlDoc = parser.parseFromString(xmlText, 'text/xml')
  
  // Verificar errores de parsing
  const parserError = xmlDoc.querySelector('parsererror')
  if (parserError) {
    throw new Error('Error parsing XML: ' + parserError.textContent)
  }

  return xmlDoc
}

// Extraer propiedades del XML
function extractPropertiesFromXML(xmlDoc: Document): any[] {
  const propiedades: any[] = []
  const propiedadNodes = xmlDoc.querySelectorAll('propiedad')
  
  console.log(`[XMLPropertiesService] Encontrados ${propiedadNodes.length} nodos <propiedad>`)
  
  propiedadNodes.forEach((propNode, index) => {
    const prop: any = {}
    
    // Extraer todos los elementos hijos directamente
    Array.from(propNode.children).forEach((child) => {
      const nodeName = child.nodeName
      
      // Si tiene estructura con <datos>, procesar también
      if (nodeName === 'datos') {
        const datos: any = {}
        Array.from(child.children).forEach((datoChild) => {
          datos[datoChild.nodeName] = datoChild.textContent || ''
        })
        prop.datos = datos
        // Combinar datos con propiedades del nivel superior (datos tiene prioridad)
        Object.assign(prop, datos)
      } 
      // Si tiene estructura con <fotos>, procesar las imágenes
      else if (nodeName === 'fotos') {
        const fotos: string[] = []
        Array.from(child.children).forEach((fotoChild) => {
          if (fotoChild.nodeName === 'foto' || fotoChild.tagName.toLowerCase() === 'foto') {
            const fotoUrl = fotoChild.textContent?.trim() || ''
            if (fotoUrl && fotoUrl.startsWith('http')) {
              fotos.push(fotoUrl)
            }
          }
        })
        prop.fotos = { foto: fotos }
      } 
      // Otros campos directos
      else {
        prop[nodeName] = child.textContent || ''
      }
    })
    
    // Log primera propiedad para debugging
    if (index === 0) {
      console.log('[XMLPropertiesService] Primera propiedad extraída:', {
        keys: Object.keys(prop),
        codOfer: prop.ofertas_cod_ofer || prop.datos?.ofertas_cod_ofer,
        hasFotos: !!prop.fotos,
        fotosCount: prop.fotos?.foto?.length || 0
      })
    }
    
    propiedades.push(prop)
  })
  
  return propiedades
}

// Cargar propiedades desde XML
export async function loadPropertiesFromXML(): Promise<Property[]> {
  try {
    console.log('[XMLPropertiesService] Cargando XML desde:', XML_URL)
    
    // Fetch del XML con manejo de CORS
    const response = await fetch(XML_URL, {
      method: 'GET',
      mode: 'cors',
      cache: 'no-cache',
      headers: {
        'Accept': 'application/xml, text/xml, */*',
      },
    })
    
    if (!response.ok) {
      console.error(`[XMLPropertiesService] HTTP error! status: ${response.status}`)
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const xmlText = await response.text()
    console.log(`[XMLPropertiesService] XML cargado (${xmlText.length} caracteres)`)
    
    if (!xmlText || xmlText.length === 0) {
      throw new Error('XML vacío o no válido')
    }
    
    // Parsear XML
    const xmlDoc = parseXML(xmlText)
    
    // Extraer propiedades
    const propiedades = extractPropertiesFromXML(xmlDoc)
    console.log(`[XMLPropertiesService] Encontradas ${propiedades.length} propiedades en XML`)
    
    if (propiedades.length === 0) {
      console.warn('[XMLPropertiesService] No se encontraron propiedades en el XML')
      // Intentar método alternativo de extracción
      const altPropiedades = extractPropertiesAlternative(xmlDoc)
      console.log(`[XMLPropertiesService] Método alternativo encontró ${altPropiedades.length} propiedades`)
      if (altPropiedades.length > 0) {
        const properties = altPropiedades
          .map((prop) => transformInmovillaProperty(prop))
          .filter((prop): prop is Property => prop !== null)
        console.log(`[XMLPropertiesService] Transformadas ${properties.length} propiedades`)
        return properties
      }
      return []
    }
    
    // Transformar propiedades
    const properties = propiedades
      .map((prop) => transformInmovillaProperty(prop))
      .filter((prop): prop is Property => prop !== null)
    
    console.log(`[XMLPropertiesService] Transformadas ${properties.length} propiedades`)
    
    if (properties.length === 0 && propiedades.length > 0) {
      console.warn('[XMLPropertiesService] Todas las propiedades fueron filtradas durante la transformación')
      console.log('[XMLPropertiesService] Primera propiedad sin transformar:', propiedades[0])
    }
    
    return properties
  } catch (error) {
    console.error('[XMLPropertiesService] Error cargando propiedades desde XML:', error)
    if (error instanceof Error) {
      console.error('[XMLPropertiesService] Error message:', error.message)
      console.error('[XMLPropertiesService] Error stack:', error.stack)
    }
    return []
  }
}

// Método alternativo de extracción si el primero falla
function extractPropertiesAlternative(xmlDoc: Document): any[] {
  const propiedades: any[] = []
  
  // Buscar todas las propiedades posibles
  const allNodes = xmlDoc.querySelectorAll('*')
  const propiedadNodes: Element[] = []
  
  allNodes.forEach((node) => {
    if (node.nodeName === 'propiedad' || node.nodeName.toLowerCase() === 'propiedad') {
      propiedadNodes.push(node as Element)
    }
  })
  
  propiedadNodes.forEach((propNode) => {
    const prop: any = {}
    
    // Extraer atributos
    Array.from(propNode.attributes).forEach((attr) => {
      prop[attr.name] = attr.value
    })
    
    // Extraer elementos hijos
    Array.from(propNode.children).forEach((child) => {
      const nodeName = child.nodeName
      const nodeValue = child.textContent || ''
      
      if (nodeName === 'datos') {
        const datos: any = {}
        Array.from(child.children).forEach((datoChild) => {
          datos[datoChild.nodeName] = datoChild.textContent || ''
        })
        prop.datos = datos
        Object.assign(prop, datos)
      } else {
        prop[nodeName] = nodeValue
      }
    })
    
    propiedades.push(prop)
  })
  
  return propiedades
}

// Filtrar propiedades
export function filterProperties(properties: Property[], filters: {
  type?: string
  city?: string
  minPrice?: number
  maxPrice?: number
  bedrooms?: number
  minArea?: number
}): Property[] {
  return properties.filter((prop) => {
    if (filters.type && filters.type !== 'todos' && prop.type !== filters.type) {
      return false
    }
    
    if (filters.city && !prop.location.city.toLowerCase().includes(filters.city.toLowerCase())) {
      return false
    }
    
    if (filters.minPrice && prop.price < filters.minPrice) {
      return false
    }
    
    if (filters.maxPrice && prop.price > filters.maxPrice) {
      return false
    }
    
    if (filters.bedrooms && prop.features.bedrooms < filters.bedrooms) {
      return false
    }
    
    if (filters.minArea && prop.features.area < filters.minArea) {
      return false
    }
    
    return true
  })
}

// Buscar propiedad por codOfer
export function findPropertyByCodOfer(properties: Property[], codOfer: string): Property | null {
  return properties.find((prop) => prop.codOfer === codOfer) || null
}

// Buscar propiedad por ID
export function findPropertyById(properties: Property[], id: string): Property | null {
  return properties.find((prop) => prop._id === id || prop.codOfer === id) || null
}
