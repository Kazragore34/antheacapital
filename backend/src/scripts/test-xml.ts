// Script para probar la carga del XML de Inmovilla
// Ejecutar: npm run test-xml (después de agregar el script)

import * as xml2js from 'xml2js'
import * as https from 'https'
import * as http from 'http'

const XML_URL = 'https://procesos.inmovilla.com/xml/xml2demo/2-web.xml'

function fetchXML(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    console.log(`Fetching XML from: ${url}`)
    const client = url.startsWith('https') ? https : http
    client.get(url, (res) => {
      console.log(`HTTP Status: ${res.statusCode}`)
      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode}: ${res.statusMessage}`))
        return
      }
      let data = ''
      res.on('data', (chunk) => { data += chunk })
      res.on('end', () => {
        console.log(`XML fetched: ${data.length} chars`)
        resolve(data)
      })
      res.on('error', reject)
    }).on('error', reject)
  })
}

async function testXML() {
  try {
    console.log('=== Testing Inmovilla XML Loading ===\n')
    
    // 1. Fetch XML
    const xmlContent = await fetchXML(XML_URL)
    console.log(`✅ XML loaded: ${xmlContent.length} characters\n`)
    
    // 2. Parse XML
    console.log('Parsing XML...')
    const parser = new xml2js.Parser({ explicitArray: false, mergeAttrs: true })
    const result = await parser.parseStringPromise(xmlContent)
    
    console.log('✅ XML parsed successfully\n')
    console.log('Root keys:', Object.keys(result))
    console.log('\n')
    
    // 3. Check structure
    if (result.propiedades) {
      console.log('✅ Found "propiedades" key')
      console.log('propiedades keys:', Object.keys(result.propiedades))
      
      if (result.propiedades.propiedad) {
        const props = Array.isArray(result.propiedades.propiedad) 
          ? result.propiedades.propiedad 
          : [result.propiedades.propiedad]
        
        console.log(`\n✅ Found ${props.length} propiedades`)
        
        if (props.length > 0) {
          const firstProp = props[0]
          console.log('\n=== First Property Structure ===')
          console.log('Keys:', Object.keys(firstProp).slice(0, 30).join(', '))
          
          if (firstProp.datos) {
            console.log('\n✅ Has "datos" nested structure')
            console.log('datos keys:', Object.keys(firstProp.datos).slice(0, 30).join(', '))
            console.log('datos.id:', firstProp.datos.id)
            console.log('datos.ofertas_cod_ofer:', firstProp.datos.ofertas_cod_ofer)
          } else {
            console.log('\n⚠️ No "datos" structure - properties are at root level')
            console.log('First prop id:', firstProp.id || firstProp.ofertas_cod_ofer)
            console.log('First prop precio:', firstProp.ofertas_precioinmo || firstProp.ofertas_precioalq || firstProp.precio)
          }
          
          // Check for cod_ofer
          const codOfer = firstProp.ofertas_cod_ofer || firstProp.datos?.ofertas_cod_ofer || firstProp.datos?.id || firstProp.id
          console.log('\n=== cod_ofer found ===')
          console.log('cod_ofer:', codOfer)
          
          // Check for price
          const precio = firstProp.ofertas_precioinmo || firstProp.ofertas_precioalq || firstProp.datos?.ofertas_precioinmo || firstProp.datos?.ofertas_precioalq
          console.log('\n=== Price found ===')
          console.log('precio:', precio)
          
          // Check for title
          const titulo = firstProp.ofertas_titulo1 || firstProp.titulo1 || firstProp.datos?.ofertas_titulo1 || firstProp.datos?.titulo1
          console.log('\n=== Title found ===')
          console.log('titulo:', titulo)
        }
      } else {
        console.log('❌ No "propiedad" found in propiedades')
      }
    } else {
      console.log('❌ No "propiedades" key found')
      console.log('Available keys:', Object.keys(result))
    }
    
    console.log('\n=== Test Complete ===')
  } catch (error) {
    console.error('❌ Error:', error)
    if (error instanceof Error) {
      console.error('Message:', error.message)
      console.error('Stack:', error.stack)
    }
    process.exit(1)
  }
}

testXML()
