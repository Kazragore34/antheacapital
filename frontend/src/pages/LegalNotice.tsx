const LegalNotice = () => {
  return (
    <div className="min-h-screen bg-white py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="font-serif text-4xl md:text-5xl mb-8 text-black-soft">
          Aviso Legal
        </h1>
        
        <div className="prose max-w-none space-y-6 text-gray-700">
          <section>
            <h2 className="font-serif text-2xl mb-4 text-black-soft">1. Datos Identificativos</h2>
            <p>
              En cumplimiento con el deber de información recogido en artículo 10 de la Ley 34/2002, de 11 
              de julio, de Servicios de la Sociedad de la Información y del Comercio Electrónico, a continuación 
              se reflejan los siguientes datos:
            </p>
            <div className="mt-4 bg-gray-50 p-4 rounded-lg">
              <p>
                <strong>Denominación social:</strong> Anthea Capital Consulting<br />
                <strong>Dirección:</strong> Calle Magnolias 32°A, 28300, Aranjuez, Madrid, España<br />
                <strong>Email:</strong> admin@antheacapital.es<br />
                <strong>Teléfono:</strong> +34 656 61 74 65
              </p>
            </div>
          </section>

          <section>
            <h2 className="font-serif text-2xl mb-4 text-black-soft">2. Objeto</h2>
            <p>
              El presente aviso legal regula el uso del sitio web antheacapital.es (en adelante, el sitio web), 
              del que es titular Anthea Capital Consulting.
            </p>
            <p className="mt-4">
              La navegación por el sitio web de Anthea Capital Consulting implica la aceptación de todas las 
              disposiciones incluidas en este aviso legal, así como de la política de privacidad y política 
              de cookies.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl mb-4 text-black-soft">3. Condiciones de Uso</h2>
            <p>
              El acceso y uso del sitio web se encuentra sujeto a las siguientes condiciones:
            </p>
            <ul className="list-disc pl-6 mt-2">
              <li>El usuario se compromete a hacer un uso adecuado y lícito del sitio web.</li>
              <li>Queda prohibido cualquier uso del sitio web con fines ilícitos o no autorizados.</li>
              <li>El usuario no podrá reproducir, copiar, vender, revender o explotar cualquier parte del sitio web.</li>
              <li>El usuario se compromete a no realizar ninguna acción que pueda dañar, inutilizar, sobrecargar o deteriorar el sitio web.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-2xl mb-4 text-black-soft">4. Propiedad Intelectual</h2>
            <p>
              Todos los contenidos del sitio web, incluyendo textos, gráficos, logotipos, iconos, imágenes, 
              clips de audio, descargas digitales, compilaciones de datos y software, son propiedad de 
              Anthea Capital Consulting o de sus proveedores de contenido y están protegidos por las leyes 
              españolas e internacionales sobre propiedad intelectual.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl mb-4 text-black-soft">5. Exclusión de Garantías y Responsabilidad</h2>
            <p>
              Anthea Capital Consulting no se hace responsable de la información, contenidos, productos o 
              servicios ofrecidos a través del sitio web por terceros. Asimismo, no garantiza la disponibilidad 
              y continuidad del funcionamiento del sitio web.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl mb-4 text-black-soft">6. Modificaciones</h2>
            <p>
              Anthea Capital Consulting se reserva el derecho de realizar sin previo aviso las modificaciones 
              que considere oportunas en su portal, pudiendo cambiar, suprimir o añadir tanto los contenidos 
              y servicios que se presten a través de la misma como la forma en la que éstos aparezcan 
              presentados o localizados en su portal.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl mb-4 text-black-soft">7. Enlaces</h2>
            <p>
              En el caso de que en el sitio web se dispusiesen enlaces hacia otros sitios web, Anthea Capital 
              Consulting no ejercerá ningún tipo de control sobre dichos sitios y contenidos. En ningún caso 
              asumirá responsabilidad alguna por los contenidos de algún enlace perteneciente a un sitio web 
              ajeno, ni garantizará la disponibilidad técnica, calidad, fiabilidad, exactitud, amplitud, 
              veracidad, validez y constitucionalidad de cualquier material o información contenida en ninguno 
              de dichos hipervínculos u otros sitios de Internet.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl mb-4 text-black-soft">8. Ley Aplicable y Jurisdicción</h2>
            <p>
              Para la resolución de todas las controversias o cuestiones relacionadas con el presente sitio 
              web o de las actividades en él desarrolladas, será de aplicación la legislación española, a la 
              que se someten expresamente las partes, siendo competentes para la resolución de todos los 
              conflictos derivados o relacionados con su uso los Juzgados y Tribunales de Madrid.
            </p>
          </section>

          <section className="mt-8 pt-8 border-t">
            <p className="text-sm text-gray-500">
              Última actualización: {new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}

export default LegalNotice

