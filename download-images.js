const fs = require('fs');
const https = require('https');
const http = require('http');
const path = require('path');

// Crear carpeta para imágenes
const imagesDir = path.join(__dirname, 'archivos en bruto', 'imagenes');
if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
}

// Leer el XML
const xmlPath = path.join(__dirname, 'archivos en bruto', 'listado.xml');
const xmlContent = fs.readFileSync(xmlPath, 'utf-8');

// Extraer URLs de imágenes usando regex
const fotoRegex = /<foto\d+>(https?:\/\/[^<]+)<\/foto\d+>/g;
const matches = [...xmlContent.matchAll(fotoRegex)];

// Extraer IDs de propiedades
const idRegex = /<id>(\d+)<\/id>/g;
const idMatches = [...xmlContent.matchAll(idRegex)];

console.log(`📊 Encontradas ${matches.length} imágenes`);
console.log(`📊 Encontradas ${idMatches.length} propiedades`);

let downloadedImages = 0;
let failedImages = 0;
const imageMap = {};
let currentPropIndex = 0;

// Agrupar imágenes por propiedad (asumiendo que las imágenes están después del ID)
matches.forEach((match, index) => {
    // Encontrar el ID de propiedad más cercano antes de esta imagen
    let propId = 'unknown';
    for (let i = currentPropIndex; i < idMatches.length; i++) {
        const idMatch = idMatches[i];
        const idPos = xmlContent.indexOf(idMatch[0]);
        const imgPos = xmlContent.indexOf(match[0]);
        if (idPos < imgPos) {
            propId = idMatch[1];
            currentPropIndex = i;
            break;
        }
    }

    if (!imageMap[propId]) {
        imageMap[propId] = [];
    }

    const imageUrl = match[1];
    const url = new URL(imageUrl);
    const filename = path.basename(url.pathname);
    const localPath = path.join(imagesDir, `${propId}_${filename}`);
    
    imageMap[propId].push({
        original: imageUrl,
        local: `archivos en bruto/imagenes/${propId}_${filename}`,
        filename: filename
    });

    // Descargar imagen
    const file = fs.createWriteStream(localPath);
    const protocol = url.protocol === 'https:' ? https : http;
    
    protocol.get(imageUrl, (response) => {
        if (response.statusCode === 200) {
            response.pipe(file);
            file.on('finish', () => {
                file.close();
                downloadedImages++;
                if (downloadedImages % 10 === 0) {
                    console.log(`[${downloadedImages}/${matches.length}] Imágenes descargadas...`);
                }
            });
        } else {
            failedImages++;
            if (fs.existsSync(localPath)) {
                fs.unlinkSync(localPath);
            }
        }
    }).on('error', (err) => {
        failedImages++;
        if (fs.existsSync(localPath)) {
            fs.unlinkSync(localPath);
        }
    });
});

// Guardar mapa de imágenes después de un delay
setTimeout(() => {
    const mapPath = path.join(imagesDir, 'image-map.json');
    fs.writeFileSync(mapPath, JSON.stringify(imageMap, null, 2));
    console.log(`\n✅ Mapa de imágenes guardado en: ${mapPath}`);
    console.log(`✅ Imágenes descargadas: ${downloadedImages}`);
    console.log(`❌ Imágenes fallidas: ${failedImages}`);
}, 5000);
