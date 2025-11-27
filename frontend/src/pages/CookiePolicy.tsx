const CookiePolicy = () => {
  return (
    <div className="min-h-screen bg-white py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="font-serif text-4xl md:text-5xl mb-8 text-black-soft">
          Política de Cookies
        </h1>
        
        <div className="prose max-w-none space-y-6 text-gray-700">
          <section>
            <h2 className="font-serif text-2xl mb-4 text-black-soft">1. ¿Qué son las cookies?</h2>
            <p>
              Las cookies son pequeños archivos de texto que se almacenan en su dispositivo cuando visita 
              un sitio web. Estas cookies permiten que el sitio web recuerde sus acciones y preferencias 
              durante un período de tiempo, por lo que no tiene que volver a configurarlas cada vez que 
              regrese al sitio o navegue de una página a otra.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl mb-4 text-black-soft">2. Cookies Utilizadas</h2>
            <p>
              Este sitio web utiliza cookies propias y/o de terceros con la finalidad de conocer los hábitos 
              de navegación del usuario, realizar estadísticas y ofrecer contenidos adaptados a sus preferencias.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl mb-4 text-black-soft">3. Tipos de Cookies</h2>
            
            <div className="mt-4">
              <h3 className="font-semibold text-lg mb-2">Cookies Necesarias - Cookies Técnicas</h3>
              <p>
                Estas cookies son necesarias para que el sitio web funcione y no se pueden desactivar en 
                nuestros sistemas. Se configuran en respuesta a tus acciones realizadas al solicitar servicios, 
                como establecer tus preferencias de privacidad, iniciar sesión o completar formularios y en 
                ningún caso almacenan información personal.
              </p>
            </div>

            <div className="mt-4">
              <h3 className="font-semibold text-lg mb-2">Cookies de Rendimiento</h3>
              <p>
                Estas cookies nos permiten contar las visitas y fuentes de tráfico para poder medir y mejorar 
                el rendimiento de nuestro sitio. Nos ayudan a saber qué páginas son las más y menos populares 
                y ver cómo los visitantes se mueven por el sitio.
              </p>
            </div>

            <div className="mt-4">
              <h3 className="font-semibold text-lg mb-2">Cookies de Funcionalidad</h3>
              <p>
                Estas cookies permiten que el sitio web proporcione una funcionalidad y personalización 
                mejoradas. Pueden ser establecidas por nosotros o por proveedores externos cuyos servicios 
                hemos añadido a nuestras páginas.
              </p>
            </div>

            <div className="mt-4">
              <h3 className="font-semibold text-lg mb-2">Cookies Dirigidas</h3>
              <p>
                Estas cookies pueden ser establecidas a través de nuestro sitio por nuestros socios publicitarios. 
                Pueden ser utilizadas por esas empresas para construir un perfil de sus intereses y mostrarle 
                anuncios relevantes en otros sitios.
              </p>
            </div>

            <div className="mt-4">
              <h3 className="font-semibold text-lg mb-2">Cookies de Redes Sociales</h3>
              <p>
                Estas cookies se utilizan para habilitar funciones de redes sociales, como compartir contenido 
                del sitio web en redes sociales, leer publicaciones o ver vídeos proporcionados por terceros.
              </p>
            </div>
          </section>

          <section>
            <h2 className="font-serif text-2xl mb-4 text-black-soft">4. Gestión de Cookies</h2>
            <p>
              Puede gestionar sus preferencias de cookies en cualquier momento accediendo a la{' '}
              <a href="/" className="text-gold hover:underline">
                configuración de cookies
              </a>{' '}
              o mediante el enlace "Ver configuración" disponible en esta política.
            </p>
            <p className="mt-4">
              También puede configurar su navegador para rechazar o eliminar cookies. Sin embargo, tenga en 
              cuenta que si rechaza o elimina las cookies, es posible que algunas funciones del sitio web no 
              estén disponibles.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl mb-4 text-black-soft">5. Enlaces a Sistemas de Desactivación</h2>
            <p>Para desactivar las cookies de terceros, puede acceder a los siguientes enlaces:</p>
            <ul className="list-disc pl-6 mt-2">
              <li>
                <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-gold hover:underline">
                  Chrome
                </a>
              </li>
              <li>
                <a href="https://support.mozilla.org/es/kb/habilitar-y-deshabilitar-cookies-sitios-web-rastrear-preferencias" target="_blank" rel="noopener noreferrer" className="text-gold hover:underline">
                  Firefox
                </a>
              </li>
              <li>
                <a href="https://support.microsoft.com/es-es/microsoft-edge/eliminar-las-cookies-en-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer" className="text-gold hover:underline">
                  Microsoft Edge
                </a>
              </li>
              <li>
                <a href="https://support.apple.com/es-es/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-gold hover:underline">
                  Safari
                </a>
              </li>
            </ul>
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

export default CookiePolicy

